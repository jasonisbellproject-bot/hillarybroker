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

    // Get filter parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('investments')
      .select(`
        *,
        users!inner(email, first_name, last_name),
        investment_plans!inner(name)
      `, { count: 'exact' });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: investments, error, count } = await query;

    if (error) {
      console.error('Error fetching investments:', error);
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
    }

    // Format investments for the frontend
    const formattedInvestments = investments?.map(investment => {
      const startDate = new Date(investment.created_at);
      const endDate = new Date(startDate.getTime() + (investment.duration_days || 30) * 24 * 60 * 60 * 1000);
      const now = new Date();
      const progress = Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
      
      const totalReturn = investment.amount * (investment.daily_return || 0) * (investment.duration_days || 30) / 100;

      return {
        id: investment.id,
        user: `${investment.users.first_name} ${investment.users.last_name}`,
        plan: investment.investment_plans.name,
        amount: investment.amount,
        dailyReturn: investment.daily_return || 0,
        totalReturn: totalReturn,
        startDate: investment.created_at,
        endDate: endDate.toISOString(),
        status: investment.status,
        progress: Math.round(progress)
      };
    }) || [];

    // Calculate stats
    const totalInvestments = formattedInvestments.length;
    const activeInvestments = formattedInvestments.filter(inv => inv.status === 'active').length;
    const totalReturns = formattedInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0);
    const averageReturn = totalInvestments > 0 ? (totalReturns / totalInvestments) : 0;

    const stats = {
      totalInvestments,
      activeInvestments,
      totalReturns: Math.round(totalReturns * 100) / 100,
      averageReturn: Math.round(averageReturn * 100) / 100
    };

    return NextResponse.json({
      investments: formattedInvestments,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in admin investments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 