import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    const user = auth.user;

    // Get the user stake
    const { data: stake, error: stakeError } = await supabase
      .from('user_stakes')
      .select(`
        *,
        staking_pools(name)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (stakeError || !stake) {
      return NextResponse.json({ error: 'Stake not found' }, { status: 404 });
    }

    // Check if stake is active
    if (stake.status !== 'active') {
      return NextResponse.json({ error: 'Stake is not active' }, { status: 400 });
    }

    // Get user's current balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 });
    }

    // Calculate rewards earned since last claim (or since stake start)
    const startDate = new Date(stake.created_at);
    const lastClaimDate = stake.last_reward_claim ? new Date(stake.last_reward_claim) : startDate;
    const now = new Date();
    
    const timeSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (24 * 60 * 60 * 1000); // days
    const rewardsEarned = (stake.amount * stake.apy * timeSinceLastClaim) / (365 * 100);

    // Check if there are rewards to claim (minimum 1 day of rewards)
    if (timeSinceLastClaim < 1) {
      return NextResponse.json({ 
        error: 'Minimum 1 day of staking required to claim rewards' 
      }, { status: 400 });
    }

    if (rewardsEarned <= 0) {
      return NextResponse.json({ 
        error: 'No rewards available to claim' 
      }, { status: 400 });
    }

    // Update stake with new last reward claim date
    const { error: updateError } = await supabase
      .from('user_stakes')
      .update({
        last_reward_claim: now.toISOString(),
        total_rewards_claimed: (stake.total_rewards_claimed || 0) + rewardsEarned,
        updated_at: now.toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update stake' }, { status: 500 });
    }

    // Add rewards to user wallet
    const { error: balanceError } = await supabase
      .from('users')
      .update({
        wallet_balance: userData.wallet_balance + rewardsEarned
      })
      .eq('id', user.id);

    if (balanceError) {
      return NextResponse.json({ error: 'Failed to update wallet balance' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'reward',
        amount: rewardsEarned,
        currency: 'USD',
        method: stake.staking_pools.name,
        reference: `REWARD-${stake.id}`,
        status: 'completed',
        metadata: {
          stake_id: stake.id,
          staking_pool: stake.staking_pools.name,
          time_staked_days: timeSinceLastClaim
        }
      });

    if (transactionError) {
      console.error('Error creating reward transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      message: 'Rewards claimed successfully',
      data: {
        rewardsClaimed: rewardsEarned,
        timeStaked: timeSinceLastClaim,
        newBalance: userData.wallet_balance + rewardsEarned
      }
    });

  } catch (error) {
    console.error('Error in claim rewards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 