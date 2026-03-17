import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    console.log('Fetching recent transactions for user:', userId);

    const supabase = await createClient();

    // Fetch recent deposits
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('id, amount, payment_method, status, created_at, transaction_hash')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError);
    }

    // Fetch recent withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('id, amount, method, status, created_at, wallet_address')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError);
    }

    // Fetch recent investments
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        id, 
        amount, 
        status, 
        created_at,
        investment_plans(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError);
    }

    // Fetch recent rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('id, amount, type, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
    }

    // Fetch recent stakes
    const { data: stakes, error: stakesError } = await supabase
      .from('user_stakes')
      .select(`
        id, 
        amount, 
        status, 
        created_at, 
        rewards_earned,
        staking_pools(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (stakesError) {
      console.error('Error fetching stakes:', stakesError);
    }

    // Calculate stats
    const totalDeposits = (deposits || [])
      .filter(d => d.status === 'completed' || d.status === 'approved')
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const totalWithdrawals = (withdrawals || [])
      .filter(w => w.status === 'completed' || w.status === 'approved')
      .reduce((sum, w) => sum + parseFloat(w.amount), 0);

    const totalEarnings = (rewards || [])
      .filter(r => r.status === 'claimed' || r.status === 'completed')
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const totalInvestments = (investments || [])
      .filter(i => i.status === 'active' || i.status === 'completed')
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    // Combine all transactions and sort by date
    const allTransactions = [
      ...(deposits || []).map(deposit => ({
        id: `deposit_${deposit.id}`,
        type: 'deposit',
        title: 'Deposit',
        description: `${deposit.payment_method} deposit`,
        method: deposit.payment_method,
        amount: deposit.amount,
        status: deposit.status,
        date: deposit.created_at,
        reference: deposit.transaction_hash,
        hash: deposit.transaction_hash,
        icon: 'DollarSign',
        color: 'green'
      })),
      ...(withdrawals || []).map(withdrawal => ({
        id: `withdrawal_${withdrawal.id}`,
        type: 'withdrawal',
        title: 'Withdrawal',
        description: `${withdrawal.method} withdrawal`,
        method: withdrawal.method,
        amount: -withdrawal.amount, // Negative for withdrawals
        status: withdrawal.status,
        date: withdrawal.created_at,
        reference: withdrawal.wallet_address,
        hash: withdrawal.wallet_address,
        icon: 'ArrowDownRight',
        color: 'red'
      })),
      ...(investments || []).map(investment => ({
        id: `investment_${investment.id}`,
        type: 'investment',
        title: 'Investment',
        description: `${investment.investment_plans?.name || 'Investment Plan'} investment`,
        method: investment.investment_plans?.name || 'Investment Plan',
        amount: -investment.amount, // Negative for investments
        status: investment.status,
        date: investment.created_at,
        reference: investment.investment_plans?.name || 'Investment Plan',
        hash: investment.investment_plans?.name || 'Investment Plan',
        icon: 'TrendingUp',
        color: 'blue'
      })),
      ...(rewards || []).map(reward => ({
        id: `reward_${reward.id}`,
        type: 'reward',
        title: reward.type === 'referral' ? 'Referral Bonus' : 'Daily Reward',
        description: reward.type === 'referral' ? 'Referral bonus earned' : 'Daily login reward',
        method: reward.type === 'referral' ? 'Referral Bonus' : 'Daily Reward',
        amount: reward.amount,
        status: reward.status,
        date: reward.created_at,
        reference: reward.type,
        hash: reward.type,
        icon: reward.type === 'referral' ? 'Users' : 'Gift',
        color: reward.type === 'referral' ? 'blue' : 'orange'
      })),
      ...(stakes || []).map(stake => ({
        id: `stake_${stake.id}`,
        type: 'stake',
        title: 'Staking',
        description: `${stake.staking_pools?.name || 'Staking Pool'} stake`,
        method: stake.staking_pools?.name || 'Staking Pool',
        amount: -stake.amount, // Negative for stakes
        status: stake.status,
        date: stake.created_at,
        reference: stake.staking_pools?.name || 'Staking Pool',
        hash: stake.staking_pools?.name || 'Staking Pool',
        icon: 'Coins',
        color: 'purple',
        rewards: stake.rewards_earned
      }))
    ];

    // Sort by date (most recent first) and limit to 20 transactions
    const recentTransactions = allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    return NextResponse.json({
      transactions: recentTransactions,
      stats: {
        totalDeposits,
        totalWithdrawals,
        totalEarnings,
        totalInvestments
      }
    });

  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 