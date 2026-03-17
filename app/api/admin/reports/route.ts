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

    // Get date range parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();
    const reportType = searchParams.get('type') || 'overview';

    let reportData = {};

    switch (reportType) {
      case 'overview':
        // Generate overview report
        const [
          { count: totalUsers },
          { count: newUsers },
          { data: totalRevenue },
          { data: totalWithdrawals },
          { data: totalInvestments },
          { data: totalStakes }
        ] = await Promise.all([
          // Total users
          supabase.from('users').select('*', { count: 'exact', head: true }),
          
          // New users in date range
          supabase.from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startDate)
            .lte('created_at', endDate),
          
          // Total revenue (deposits)
          supabase.from('transactions')
            .select('amount')
            .eq('type', 'deposit')
            .eq('status', 'completed')
            .gte('created_at', startDate)
            .lte('created_at', endDate),
          
          // Total withdrawals (both approved and completed)
          supabase.from('withdrawals')
            .select('amount')
            .in('status', ['approved', 'completed'])
            .gte('created_at', startDate)
            .lte('created_at', endDate),
          
          // Total investments
          supabase.from('investments')
            .select('amount')
            .eq('status', 'active')
            .gte('created_at', startDate)
            .lte('created_at', endDate),
          
          // Total stakes
          supabase.from('user_stakes')
            .select('amount')
            .eq('status', 'active')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
        ]);

        const totalRevenueAmount = totalRevenue?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        const totalWithdrawalsAmount = totalWithdrawals?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;
        const totalInvestmentsAmount = totalInvestments?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
        const totalStakesAmount = totalStakes?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

        reportData = {
          totalUsers: totalUsers || 0,
          newUsers: newUsers || 0,
          totalRevenue: totalRevenueAmount,
          totalWithdrawals: totalWithdrawalsAmount,
          totalInvestments: totalInvestmentsAmount,
          totalStakes: totalStakesAmount,
          netRevenue: totalRevenueAmount - totalWithdrawalsAmount
        };
        break;

      case 'users':
        // Generate user growth report
        const { data: userGrowth } = await supabase
          .from('users')
          .select('created_at')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: true });

        // Group by date
        const userGrowthByDate = userGrowth?.reduce((acc, user) => {
          const date = new Date(user.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        reportData = {
          userGrowth: userGrowthByDate,
          totalNewUsers: userGrowth?.length || 0
        };
        break;

      case 'financial':
        // Generate financial report
        const { data: transactions } = await supabase
          .from('transactions')
          .select('type, amount, status, created_at')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: true });

        const financialData = transactions?.reduce((acc, transaction) => {
          const date = new Date(transaction.created_at).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = { deposits: 0, withdrawals: 0, investments: 0 };
          }
          
          if (transaction.status === 'completed') {
            switch (transaction.type) {
              case 'deposit':
                acc[date].deposits += transaction.amount || 0;
                break;
              case 'withdrawal':
                acc[date].withdrawals += transaction.amount || 0;
                break;
              case 'investment':
                acc[date].investments += transaction.amount || 0;
                break;
            }
          }
          
          return acc;
        }, {} as Record<string, { deposits: number; withdrawals: number; investments: number }>) || {};

        reportData = {
          financialData,
          totalTransactions: transactions?.length || 0
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return NextResponse.json({
      reportType,
      dateRange: { startDate, endDate },
      data: reportData
    });

  } catch (error) {
    console.error('Error in admin reports API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 