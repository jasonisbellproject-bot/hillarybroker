import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // For now, let's use the admin user ID directly for testing
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a'; // Admin user ID

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch recent activities from multiple tables
    const [
      { data: recentUsers },
      { data: recentStakes },
      { data: recentInvestments },
      { data: recentWithdrawals },
      { data: recentRewards }
    ] = await Promise.all([
      // Recent user signups
      supabase
        .from('users')
        .select('id, email, first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent stakes
      supabase
        .from('user_stakes')
        .select(`
          id, amount, apy, created_at,
          users!inner(email, first_name, last_name),
          staking_pools!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent investments
      supabase
        .from('investments')
        .select(`
          id, amount, daily_return, created_at,
          users!inner(email, first_name, last_name),
          investment_plans!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent withdrawals
      supabase
        .from('withdrawals')
        .select(`
          id, amount, method, status, created_at,
          users!inner(email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent rewards
      supabase
        .from('rewards')
        .select(`
          id, type, amount, description, created_at,
          users!inner(email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Combine and format activities
    const activities = [];

    // Add user signups
    if (recentUsers) {
      recentUsers.forEach(user => {
        activities.push({
          id: user.id,
          type: 'user_signup',
          user: `${user.first_name} ${user.last_name}`,
          email: user.email,
          timestamp: user.created_at,
          status: 'completed'
        });
      });
    }

    // Add stakes
    if (recentStakes) {
      recentStakes.forEach(stake => {
        activities.push({
          id: stake.id,
          type: 'stake_created',
          user: `${stake.users.first_name} ${stake.users.last_name}`,
          amount: stake.amount,
          pool: stake.staking_pools.name,
          timestamp: stake.created_at,
          status: 'completed'
        });
      });
    }

    // Add investments
    if (recentInvestments) {
      recentInvestments.forEach(investment => {
        activities.push({
          id: investment.id,
          type: 'investment_made',
          user: `${investment.users.first_name} ${investment.users.last_name}`,
          amount: investment.amount,
          plan: investment.investment_plans.name,
          timestamp: investment.created_at,
          status: 'completed'
        });
      });
    }

    // Add withdrawals
    if (recentWithdrawals) {
      recentWithdrawals.forEach(withdrawal => {
        activities.push({
          id: withdrawal.id,
          type: 'withdrawal_requested',
          user: `${withdrawal.users.first_name} ${withdrawal.users.last_name}`,
          amount: withdrawal.amount,
          method: withdrawal.method,
          timestamp: withdrawal.created_at,
          status: withdrawal.status
        });
      });
    }

    // Add rewards
    if (recentRewards) {
      recentRewards.forEach(reward => {
        activities.push({
          id: reward.id,
          type: 'reward_claimed',
          user: `${reward.users.first_name} ${reward.users.last_name}`,
          amount: reward.amount,
          description: reward.description,
          timestamp: reward.created_at,
          status: reward.status
        });
      });
    }

    // Sort by timestamp and return recent activities
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json(activities.slice(0, 10));

  } catch (error) {
    console.error('Error in admin activity API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 