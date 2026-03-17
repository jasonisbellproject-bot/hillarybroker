import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { rewardId } = await request.json();

    // Validate input
    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID is required' }, { status: 400 });
    }

    // Get authenticated user
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    // Get reward details - use 'pending' status instead of 'available'
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found or not available for claiming' }, { status: 404 });
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

    // Update reward status to claimed
    const { data: updatedReward, error: updateError } = await supabase
      .from('rewards')
      .update({ 
        status: 'claimed',
        claimed_at: new Date().toISOString()
      })
      .eq('id', rewardId)
      .select()
      .single();

    if (updateError) {
      console.error('Error claiming reward:', updateError);
      return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 });
    }

    // Update user balance - fix the doubling bug
    const newBalance = userData.wallet_balance + reward.amount;
    const { error: balanceError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Rollback the reward claim
      await supabase
        .from('rewards')
        .update({ 
          status: 'pending',
          claimed_at: null
        })
        .eq('id', rewardId);
      return NextResponse.json({ error: 'Failed to update wallet balance' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'reward',
        amount: reward.amount,
        currency: 'USD',
        method: reward.type,
        reference: `REWARD-${rewardId}`,
        status: 'completed',
        metadata: {
          reward_id: rewardId,
          reward_type: reward.type,
          description: reward.description
        }
      });

    if (transactionError) {
      console.error('Error creating reward transaction:', transactionError);
      // Don't fail the claim if transaction record fails
    }

    return NextResponse.json({ 
      success: true, 
      reward: updatedReward,
      message: `Successfully claimed $${reward.amount.toFixed(2)}`,
      newBalance: newBalance
    });
  } catch (error) {
    console.error('Error in claim reward API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 