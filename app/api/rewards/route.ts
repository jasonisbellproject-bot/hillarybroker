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
    const userId = auth.user.id;

    console.log('Fetching rewards for user:', userId);

    if (!userId) {
      console.error('No user ID found');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Fetch user's rewards
    const { data: rewards, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rewards:', error);
      return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
    }

    // Calculate stats
    const totalRewards = rewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0;
    const claimedRewards = rewards?.filter(reward => reward.status === 'claimed')
      .reduce((sum, reward) => sum + reward.amount, 0) || 0;
    const pendingRewards = rewards?.filter(reward => reward.status === 'pending')
      .reduce((sum, reward) => sum + reward.amount, 0) || 0;

    const stats = {
      totalRewards: Math.round(totalRewards * 100) / 100,
      claimedRewards: Math.round(claimedRewards * 100) / 100,
      pendingRewards: Math.round(pendingRewards * 100) / 100
    };

    return NextResponse.json({
      rewards: rewards || [],
      stats
    });

  } catch (error) {
    console.error('Error in rewards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const userId = auth.user.id;
    const { rewardId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID is required' }, { status: 400 });
    }

    // Get the reward
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found or already claimed' }, { status: 404 });
    }

    // Update reward status to claimed
    const { error: updateError } = await supabase
      .from('rewards')
      .update({ 
        status: 'claimed',
        claimed_at: new Date().toISOString()
      })
      .eq('id', rewardId);

    if (updateError) {
      console.error('Error claiming reward:', updateError);
      return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 });
    }

    // Add amount to user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance, total_earned')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    const { error: balanceError } = await supabase
      .from('users')
      .update({ 
        wallet_balance: userData.wallet_balance + reward.amount,
        total_earned: userData.total_earned + reward.amount
      })
      .eq('id', userId);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'reward',
        amount: reward.amount,
        currency: reward.currency,
        method: reward.type,
        reference: `REWARD-${reward.id}`,
        status: 'completed',
        metadata: { reward_id: reward.id, reward_type: reward.type }
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      claimedAmount: reward.amount,
      message: `Successfully claimed $${reward.amount} ${reward.currency}`
    });

  } catch (error) {
    console.error('Error in claim reward API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 