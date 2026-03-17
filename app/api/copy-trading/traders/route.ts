import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/copy-trading/traders - Get all active copy traders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'total_followers';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Get copy traders with user information
    const { data: traders, error } = await supabase
      .from('copy_traders')
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('is_active', true)
      .not('user_id', 'is', null)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching copy traders:', error);
      return NextResponse.json({ error: 'Failed to fetch copy traders' }, { status: 500 });
    }

    // Filter out traders without user data and get performance data
    const tradersWithPerformance = await Promise.all(
      traders
        .filter(trader => trader.users) // Only include traders with user data
        .map(async (trader) => {
          const { data: performance } = await supabase
            .from('copy_trader_performance')
            .select('*')
            .eq('trader_id', trader.id)
            .eq('period_type', 'all_time')
            .single();

          return {
            ...trader,
            performance: performance || {
              total_trades: 0,
              winning_trades: 0,
              losing_trades: 0,
              total_profit: 0,
              success_rate: 0
            }
          };
        })
    );

    return NextResponse.json(tradersWithPerformance);
  } catch (error) {
    console.error('Error in copy traders API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/copy-trading/traders - Create a new copy trader profile
export async function POST(request: NextRequest) {
  try {
    const { display_name, description, min_copy_amount, max_copy_amount, copy_fee_percentage } = await request.json();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a copy trader profile
    const { data: existingTrader } = await supabase
      .from('copy_traders')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingTrader) {
      return NextResponse.json({ error: 'You already have a copy trader profile' }, { status: 400 });
    }

    // Get user's balance to check minimum requirement
    const { data: userProfile } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    const minBalance = 1000; // Minimum balance required
    if (!userProfile || userProfile.balance < minBalance) {
      return NextResponse.json({ 
        error: `Minimum balance of $${minBalance} required to become a copy trader` 
      }, { status: 400 });
    }

    // Create copy trader profile
    const { data: trader, error } = await supabase
      .from('copy_traders')
      .insert({
        user_id: user.id,
        display_name,
        description,
        min_copy_amount: min_copy_amount || 10.00,
        max_copy_amount: max_copy_amount || 10000.00,
        copy_fee_percentage: copy_fee_percentage || 5.00
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating copy trader:', error);
      return NextResponse.json({ error: 'Failed to create copy trader profile' }, { status: 500 });
    }

    return NextResponse.json(trader, { status: 201 });
  } catch (error) {
    console.error('Error in create copy trader API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
