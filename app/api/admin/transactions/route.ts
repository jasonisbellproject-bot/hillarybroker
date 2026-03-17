import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAuth(request);
    const adminUserId = auth.user.id;

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
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Fetch deposits
    let depositsQuery = supabase
      .from('deposits')
      .select(`
        *,
        users!deposits_user_id_fkey(email, first_name, last_name)
      `);

    if (type && type !== 'deposit') {
      depositsQuery = depositsQuery.eq('id', 'none'); // No results
    }
    if (status) {
      depositsQuery = depositsQuery.eq('status', status);
    }

    const { data: deposits, error: depositsError } = await depositsQuery;

    // Fetch withdrawals
    let withdrawalsQuery = supabase
      .from('withdrawals')
      .select(`
        *,
        users!withdrawals_user_id_fkey(email, first_name, last_name)
      `);

    if (type && type !== 'withdrawal') {
      withdrawalsQuery = withdrawalsQuery.eq('id', 'none'); // No results
    }
    if (status) {
      withdrawalsQuery = withdrawalsQuery.eq('status', status);
    }

    const { data: withdrawals, error: withdrawalsError } = await withdrawalsQuery;

    if (depositsError || withdrawalsError) {
      console.error('Error fetching transactions:', { depositsError, withdrawalsError });
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    // Combine and format transactions
    const allTransactions = [];

    // Format deposits
    if (deposits) {
      deposits.forEach(deposit => {
        const userName = deposit.users?.first_name && deposit.users?.last_name 
          ? `${deposit.users.first_name} ${deposit.users.last_name}`
          : deposit.users?.email || 'Unknown User';
          
        allTransactions.push({
          id: deposit.id,
          user: userName,
          type: 'deposit',
          amount: deposit.amount,
          method: deposit.payment_method || 'N/A',
          status: deposit.status,
          date: deposit.created_at,
          hash: deposit.transaction_hash || deposit.reference || 'N/A',
          fee: 0
        });
      });
    }

    // Format withdrawals
    if (withdrawals) {
      withdrawals.forEach(withdrawal => {
        const userName = withdrawal.users?.first_name && withdrawal.users?.last_name 
          ? `${withdrawal.users.first_name} ${withdrawal.users.last_name}`
          : withdrawal.users?.email || 'Unknown User';
          
        allTransactions.push({
          id: withdrawal.id,
          user: userName,
          type: 'withdrawal',
          amount: withdrawal.amount,
          method: withdrawal.method || 'N/A',
          status: withdrawal.status,
          date: withdrawal.created_at,
          hash: withdrawal.reference || 'N/A',
          fee: 0
        });
      });
    }

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply pagination
    const total = allTransactions.length;
    const paginatedTransactions = allTransactions.slice(offset, offset + limit);

    return NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error in admin transactions API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 