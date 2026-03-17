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

    // Fetch user's stakes with pool information
    const { data: stakes, error } = await supabase
      .from('user_stakes')
      .select(`
        *,
        staking_pools(name, description, apy)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user stakes:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch user stakes',
        details: error.message 
      }, { status: 500 });
    }

    // Format stakes for the frontend
    const formattedStakes = stakes?.map(stake => {
      const startDate = new Date(stake.start_date);
      const endDate = stake.end_date ? new Date(stake.end_date) : null;
      const now = new Date();
      
      let progress = 0;
      if (endDate) {
        progress = Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
      }

      // Calculate rewards earned
      const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const rewardsEarned = (stake.amount * stake.apy * daysElapsed) / (365 * 100);

      // Check if user can unstake and claim rewards
      const canUnstake = stake.status === 'active' && (!stake.end_date || now >= endDate);
      const canClaimRewards = stake.status === 'active' && daysElapsed >= 1;
      const nextRewardDate = stake.last_reward_claim 
        ? new Date(new Date(stake.last_reward_claim).getTime() + 24 * 60 * 60 * 1000)
        : new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

      return {
        id: stake.id,
        poolName: stake.staking_pools?.name || 'Unknown Pool',
        poolDescription: stake.staking_pools?.description || '',
        amount: stake.amount,
        apy: stake.apy,
        lockPeriod: stake.lock_period,
        startDate: stake.start_date,
        endDate: stake.end_date,
        status: stake.status,
        rewardsEarned: Math.max(0, rewardsEarned),
        progress: Math.round(progress),
        canUnstake,
        canClaimRewards,
        nextRewardDate: canClaimRewards ? nextRewardDate.toISOString() : null
      };
    }) || [];

    return NextResponse.json(formattedStakes);

  } catch (error) {
    console.error('Error in user stakes API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = auth.user;
    const { poolId, amount } = await request.json();

    // Validate input
    if (!poolId || !amount) {
      return NextResponse.json({ error: 'Pool ID and amount are required' }, { status: 400 });
    }

    // Get the staking pool
    const { data: pool, error: poolError } = await supabase
      .from('staking_pools')
      .select('*')
      .eq('id', poolId)
      .eq('status', 'active')
      .single();

    if (poolError || !pool) {
      return NextResponse.json({ error: 'Invalid staking pool' }, { status: 400 });
    }

    // Validate amount
    if (amount < pool.min_stake || amount > pool.max_stake) {
      return NextResponse.json({ 
        error: `Amount must be between $${pool.min_stake} and $${pool.max_stake}` 
      }, { status: 400 });
    }

    // Check user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (userError || userData.wallet_balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate end date if lock period is specified
    const startDate = new Date();
    const endDate = pool.lock_period > 0 
      ? new Date(startDate.getTime() + pool.lock_period * 24 * 60 * 60 * 1000)
      : null;

    // Create stake
    const { data: stake, error: stakeError } = await supabase
      .from('user_stakes')
      .insert({
        user_id: user.id,
        pool_id: poolId,
        amount: amount,
        apy: pool.apy,
        lock_period: pool.lock_period,
        start_date: startDate.toISOString(),
        end_date: endDate?.toISOString() || null,
        status: 'active'
      })
      .select()
      .single();

    if (stakeError) {
      console.error('Error creating stake:', stakeError);
      return NextResponse.json({ error: 'Failed to create stake' }, { status: 500 });
    }

    // Deduct amount from user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ 
        wallet_balance: userData.wallet_balance - amount,
        total_staked: userData.total_staked + amount
      })
      .eq('id', user.id);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'investment',
        amount: amount,
        currency: 'USD',
        method: `Staking - ${pool.name}`,
        reference: `STAKE-${stake.id}`,
        status: 'completed',
        metadata: { pool_id: poolId, stake_id: stake.id }
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      stake
    });

  } catch (error) {
    console.error('Error in create stake API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 