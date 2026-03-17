import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = auth.user;

    // Fetch all active staking pools with user's stakes
    const { data: pools, error } = await supabase
      .from('staking_pools')
      .select(`
        *,
        user_stakes!left(amount, status)
      `)
      .eq('status', 'active')
      .order('apy', { ascending: false });

    if (error) {
      console.error('Error fetching staking pools:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch staking pools',
        details: error.message 
      }, { status: 500 });
    }

    // Calculate statistics for each pool
    const poolsWithStats = pools?.map(pool => {
      const totalStaked = pool.user_stakes?.reduce((sum, stake) => 
        stake.status === 'active' ? sum + (stake.amount || 0) : sum, 0) || 0;
      
      const uniqueUsers = pool.user_stakes?.filter(stake => stake.status === 'active').length || 0;
      const userStake = pool.user_stakes?.find(stake => stake.status === 'active') || null;

      return {
        id: pool.id,
        name: pool.name,
        description: pool.description,
        apy: pool.apy,
        minStake: pool.min_stake,
        maxStake: pool.max_stake,
        lockPeriod: pool.lock_period,
        totalStaked: totalStaked,
        uniqueUsers: uniqueUsers,
        status: pool.status,
        features: pool.features || [],
        userStake: userStake ? {
          amount: userStake.amount,
          status: userStake.status
        } : null
      };
    }) || [];

    return NextResponse.json(poolsWithStats);

  } catch (error) {
    console.error('Error in staking pools API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { poolId, amount } = await request.json();

    // Validate input
    if (!poolId || !amount) {
      return NextResponse.json({ error: 'Pool ID and amount are required' }, { status: 400 });
    }

    // Get authenticated user
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    // Create stake
    const { data: stake, error } = await supabase
      .from('user_stakes')
      .insert({
        user_id: userId,
        pool_id: poolId,
        amount: amount,
        apy: 25.0, // Get from pool
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        lock_period: 30,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating stake:', error);
      return NextResponse.json({ error: 'Failed to create stake' }, { status: 500 });
    }

    return NextResponse.json({ success: true, stake });
  } catch (error) {
    console.error('Error in create stake API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 