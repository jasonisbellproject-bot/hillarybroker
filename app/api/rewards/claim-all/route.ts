import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    // Get all pending rewards for the user
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
      return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
    }

    if (!rewards || rewards.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No rewards available to claim',
        totalClaimed: 0
      });
    }

    // Get current user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user balance:', userError);
      return NextResponse.json({ error: 'Failed to get user balance' }, { status: 500 });
    }

    // Calculate total amount to claim
    const totalAmount = rewards.reduce((sum, reward) => sum + reward.amount, 0);

    // Update all rewards to claimed status
    const { error: updateError } = await supabase
      .from('rewards')
      .update({ 
        status: 'claimed',
        claimed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (updateError) {
      console.error('Error claiming rewards:', updateError);
      return NextResponse.json({ error: 'Failed to claim rewards' }, { status: 500 });
    }

    // Update user balance
    const newBalance = userData.wallet_balance + totalAmount;
    const { error: balanceError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Rollback the rewards claim
      await supabase
        .from('rewards')
        .update({ 
          status: 'pending',
          claimed_at: null
        })
        .eq('user_id', userId)
        .eq('status', 'claimed');
      return NextResponse.json({ error: 'Failed to update wallet balance' }, { status: 500 });
    }

    // Create transaction records for all claimed rewards
    const transactionRecords = rewards.map(reward => ({
      user_id: userId,
      type: 'reward',
      amount: reward.amount,
      currency: 'USD',
      method: reward.type,
      reference: `REWARD-${reward.id}`,
      status: 'completed',
      metadata: {
        reward_id: reward.id,
        reward_type: reward.type,
        description: reward.description
      }
    }));

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionRecords);

    if (transactionError) {
      console.error('Error creating reward transactions:', transactionError);
      // Don't fail the claim if transaction records fail
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully claimed ${rewards.length} rewards totaling $${totalAmount.toFixed(2)}`,
      totalClaimed: rewards.length,
      totalAmount: totalAmount,
      newBalance: newBalance
    });

  } catch (error) {
    console.error('Error in claim all rewards API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 