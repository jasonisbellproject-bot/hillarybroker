import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const userId = auth.user.id;
    console.log('Dashboard stats API: userId', userId);
    
    const supabase = await createClient();

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance, total_earned, total_staked, referral_code, email, first_name, last_name, avatar_url')
      .eq('id', userId)
      .single();
    console.log('Dashboard stats API: userData', userData);

    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    // Get active stakes count and total staked amount
    const { data: activeStakes, error: stakesError } = await supabase
      .from('user_stakes')
      .select('id, amount')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (stakesError) {
      console.error('Error fetching stakes:', stakesError);
    }
    
    // Calculate total staked from active stakes
    const totalStaked = activeStakes?.reduce((sum, stake) => sum + Number(stake.amount), 0) || 0;

    // Get referral earnings (both claimed and pending)
    const { data: referralRewards, error: referralError } = await supabase
      .from('rewards')
      .select('amount, status')
      .eq('user_id', userId)
      .eq('type', 'referral');

    if (referralError) {
      console.error('Error fetching referral rewards:', referralError);
    }

    // Get daily rewards (pending rewards)
    const { data: pendingRewards, error: pendingError } = await supabase
      .from('rewards')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error fetching pending rewards:', pendingError);
    }

    // Calculate daily rewards (sum of pending rewards)
    const dailyRewards = pendingRewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0;
    const referralEarnings = referralRewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0;

    // Get referral count
    const { data: referralCountData, error: referralCountError } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('referrer_id', userId)
      .eq('status', 'active');

    if (referralCountError) {
      console.error('Error fetching referral count:', referralCountError);
    }
    const referralCount = referralCountData?.length || 0;

    // Get total deposits
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError);
    }
    const totalDeposits = deposits?.reduce((sum, deposit) => sum + Number(deposit.amount), 0) || 0;

    // Get total withdrawals (both approved and completed)
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['approved', 'completed']);

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError);
    }
    const totalWithdrawals = withdrawals?.reduce((sum, withdrawal) => sum + Number(withdrawal.amount), 0) || 0;

    const stats = {
      totalBalance: userData.wallet_balance || 0,
      totalStaked: totalStaked,
      totalEarned: userData.total_earned || 0,
      activeStakes: activeStakes?.length || 0,
      totalDeposits: totalDeposits,
      totalWithdrawals: totalWithdrawals,
      referralEarnings: referralEarnings,
      dailyRewards: dailyRewards,
      referralCount: referralCount,
      user: {
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatarUrl: userData.avatar_url,
        referralCode: userData.referral_code,
        wallet_balance: userData.wallet_balance || 0
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error in dashboard stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 