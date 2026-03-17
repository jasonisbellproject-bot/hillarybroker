import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/copy-trading/subscriptions - Get user's subscriptions
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscriptions with trader information
    const { data: subscriptions, error } = await supabase
      .from('copy_trading_subscriptions')
      .select(`
        *,
        copy_traders:trader_id (
          id,
          display_name,
          description,
          success_rate,
          total_profit,
          copy_fee_percentage,
          users:user_id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .eq('follower_id', user.id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/copy-trading/subscriptions - Subscribe to a copy trader
export async function POST(request: NextRequest) {
  try {
    const { trader_id, copy_percentage, max_amount_per_trade, auto_copy } = await request.json();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is trying to subscribe to themselves
    const { data: trader } = await supabase
      .from('copy_traders')
      .select('user_id')
      .eq('id', trader_id)
      .single();

    if (trader && trader.user_id === user.id) {
      return NextResponse.json({ error: 'You cannot subscribe to yourself' }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existingSubscription } = await supabase
      .from('copy_trading_subscriptions')
      .select('id')
      .eq('follower_id', user.id)
      .eq('trader_id', trader_id)
      .single();

    if (existingSubscription) {
      return NextResponse.json({ error: 'You are already subscribed to this trader' }, { status: 400 });
    }

    // Get trader's settings
    const { data: traderSettings } = await supabase
      .from('copy_traders')
      .select('min_copy_amount, max_copy_amount, total_followers')
      .eq('id', trader_id)
      .single();

    if (!traderSettings) {
      return NextResponse.json({ error: 'Trader not found' }, { status: 404 });
    }

    // Check follower limit
    const maxFollowers = 1000;
    if (traderSettings.total_followers >= maxFollowers) {
      return NextResponse.json({ error: 'This trader has reached the maximum number of followers' }, { status: 400 });
    }

    // Validate copy percentage
    if (copy_percentage < 1 || copy_percentage > 100) {
      return NextResponse.json({ error: 'Copy percentage must be between 1 and 100' }, { status: 400 });
    }

    // Validate max amount
    if (max_amount_per_trade && (max_amount_per_trade < traderSettings.min_copy_amount || max_amount_per_trade > traderSettings.max_copy_amount)) {
      return NextResponse.json({ 
        error: `Max amount must be between $${traderSettings.min_copy_amount} and $${traderSettings.max_copy_amount}` 
      }, { status: 400 });
    }

    // Create subscription
    const { data: subscription, error } = await supabase
      .from('copy_trading_subscriptions')
      .insert({
        follower_id: user.id,
        trader_id,
        copy_percentage: copy_percentage || 100.00,
        max_amount_per_trade,
        auto_copy: auto_copy !== false
      })
      .select(`
        *,
        copy_traders:trader_id (
          id,
          display_name,
          description,
          success_rate,
          total_profit,
          copy_fee_percentage,
          users:user_id (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error in create subscription API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
