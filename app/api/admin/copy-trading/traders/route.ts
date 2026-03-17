import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all copy traders with user information
    const { data: traders, error: tradersError } = await supabase
      .from('copy_traders')
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (tradersError) {
      console.error('Error fetching copy traders:', tradersError);
      return NextResponse.json({ error: 'Failed to fetch copy traders' }, { status: 500 });
    }

    return NextResponse.json(traders || []);

  } catch (error) {
    console.error('Error in admin copy traders API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      user_id,
      display_name,
      description,
      min_copy_amount,
      max_copy_amount,
      copy_fee_percentage,
      is_verified,
      is_active
    } = await request.json();

    // Validate required fields
    if (!user_id || !display_name || !description) {
      return NextResponse.json({ 
        error: 'User ID, display name, and description are required' 
      }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userCheckError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a copy trader
    const { data: existingTrader, error: traderCheckError } = await supabase
      .from('copy_traders')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (existingTrader) {
      return NextResponse.json({ error: 'User is already a copy trader' }, { status: 400 });
    }

    // Create copy trader
    const { data: newTrader, error: createError } = await supabase
      .from('copy_traders')
      .insert({
        user_id,
        display_name,
        description,
        min_copy_amount: min_copy_amount || 10,
        max_copy_amount: max_copy_amount || 10000,
        copy_fee_percentage: copy_fee_percentage || 5,
        is_verified: is_verified || false,
        is_active: is_active !== undefined ? is_active : true,
        total_followers: 0,
        total_copied_trades: 0,
        success_rate: 0,
        total_profit: 0
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating copy trader:', createError);
      return NextResponse.json({ 
        error: 'Failed to create copy trader',
        details: createError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      trader: newTrader
    });

  } catch (error) {
    console.error('Error in admin create copy trader API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
