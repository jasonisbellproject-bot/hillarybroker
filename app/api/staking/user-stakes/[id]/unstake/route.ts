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
        staking_pools(name, lock_period)
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

    // Check if lock period has passed
    const startDate = new Date(stake.created_at);
    const lockEndDate = new Date(startDate.getTime() + (stake.staking_pools.lock_period * 24 * 60 * 60 * 1000));
    const now = new Date();

    if (now < lockEndDate) {
      const remainingDays = Math.ceil((lockEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      return NextResponse.json({ 
        error: `Cannot unstake yet. Lock period ends in ${remainingDays} days` 
      }, { status: 400 });
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

    // Calculate rewards earned
    const timeStaked = (now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000); // days
    const rewardsEarned = (stake.amount * stake.apy * timeStaked) / (365 * 100);

    // Update stake status to completed
    const { error: updateError } = await supabase
      .from('user_stakes')
      .update({
        status: 'completed',
        end_date: now.toISOString(),
        rewards_earned: rewardsEarned,
        updated_at: now.toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update stake' }, { status: 500 });
    }

    // Return staked amount + rewards to user wallet
    const totalReturn = stake.amount + rewardsEarned;
    const { error: balanceError } = await supabase
      .from('users')
      .update({
        wallet_balance: userData.wallet_balance + totalReturn
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
        type: 'unstake',
        amount: totalReturn,
        currency: 'USD',
        method: stake.staking_pools.name,
        reference: `UNSTAKE-${stake.id}`,
        status: 'completed',
        metadata: {
          stake_id: stake.id,
          original_amount: stake.amount,
          rewards_earned: rewardsEarned
        }
      });

    if (transactionError) {
      console.error('Error creating unstake transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      message: 'Unstake successful',
      data: {
        originalAmount: stake.amount,
        rewardsEarned: rewardsEarned,
        totalReturn: totalReturn
      }
    });

  } catch (error) {
    console.error('Error in unstake API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 