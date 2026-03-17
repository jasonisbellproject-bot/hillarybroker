import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get the admin user from the database
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id')
      .eq('is_admin', true)
      .single();

    if (adminError) {
      console.error('Error finding admin user:', adminError);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('Admin user found:', adminUser.id);

    // Fetch real admin statistics from database using service role (bypasses RLS)
    const [
      { count: totalUsers },
      { count: activeUsers },
      { data: totalStaked },
      { data: totalInvested },
      { data: totalWithdrawn },
      { count: pendingWithdrawals },
      { data: totalRevenue }
    ] = await Promise.all([
      // Total users
      supabase.from('users').select('*', { count: 'exact', head: true }),
      
      // Active users (users with activity in last 7 days) - simplified for now
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Total staked amount
      supabase.from('user_stakes')
        .select('amount')
        .eq('status', 'active'),
      
      // Total invested amount
      supabase.from('investments')
        .select('amount')
        .eq('status', 'active'),
      
      // Total withdrawn amount (both approved and completed)
      supabase.from('withdrawals')
        .select('amount')
        .in('status', ['approved', 'completed']),
      
      // Pending withdrawals count
      supabase.from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Total revenue (from deposits)
      supabase.from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'completed')
    ]);

    console.log('Stats query results:', {
      totalUsers,
      activeUsers,
      totalStaked: totalStaked?.length,
      totalInvested: totalInvested?.length,
      totalWithdrawn: totalWithdrawn?.length,
      pendingWithdrawals,
      totalRevenue: totalRevenue?.length
    });

    // Calculate totals
    const totalStakedAmount = totalStaked?.reduce((sum, stake) => sum + (stake.amount || 0), 0) || 0;
    const totalInvestedAmount = totalInvested?.reduce((sum, investment) => sum + (investment.amount || 0), 0) || 0;
    const totalWithdrawnAmount = totalWithdrawn?.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0) || 0;
    const totalRevenueAmount = totalRevenue?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;

    // Calculate monthly growth (users who signed up in the last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    
    const [
      { count: recentUsers },
      { count: previousUsers }
    ] = await Promise.all([
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())
    ]);

    const monthlyGrowth = previousUsers && previousUsers > 0 
      ? ((recentUsers - previousUsers) / previousUsers) * 100 
      : recentUsers > 0 ? 100 : 0;

    const stats = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalStaked: totalStakedAmount,
      totalInvested: totalInvestedAmount,
      totalWithdrawn: totalWithdrawnAmount,
      pendingWithdrawals: pendingWithdrawals || 0,
      totalRevenue: totalRevenueAmount,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10 // Round to 1 decimal place
    };

    console.log('Final stats:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 