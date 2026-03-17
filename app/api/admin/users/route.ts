import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get search and filter parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // Increased default limit to show more users
    const offset = (page - 1) * limit;

    // Build query - just get users first
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Get financial stats for all users
    const { data: financialStats, error: financialStatsError } = await supabase
      .from('financial_stats')
      .select('*')
      .in('user_id', users?.map(u => u.id) || []);

    if (financialStatsError) {
      console.error('Error fetching financial stats:', financialStatsError);
    }

    // Format users with financial stats
    const formattedUsers = (users || []).map(user => {
      const userFinancialStats = financialStats?.find(fs => fs.user_id === user.id);
      
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        avatar_url: user.avatar_url,
        kyc_verified: user.kyc_verified || false,
        two_factor_enabled: user.two_factor_enabled || false,
        is_admin: user.is_admin || false,
        status: user.status || 'active',
        wallet_balance: user.wallet_balance || 0,
        total_earned: user.total_earned || 0,
        total_staked: userFinancialStats?.total_staked || 0,
        total_deposits: userFinancialStats?.total_deposits || 0,
        total_withdrawals: userFinancialStats?.total_withdrawals || 0,
        referral_earnings: userFinancialStats?.total_referral_earnings || 0,
        referral_count: userFinancialStats?.referral_count || 0,
        referral_code: user.referral_code || '',
        referred_by: user.referred_by || null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      };
    });

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email, first_name, last_name, is_admin = false } = await request.json();

    // Validate input
    if (!email || !first_name || !last_name) {
      return NextResponse.json({ error: 'Email, first name, and last name are required' }, { status: 400 });
    }

    // Generate referral code
    const referralCode = `${first_name.toUpperCase()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create user in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'TemporaryPassword123!', // They can change this later
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        is_admin
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        first_name,
        last_name,
        is_admin,
        referral_code: referralCode,
        status: 'active',
        kyc_verified: true
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.user.id,
        email,
        first_name,
        last_name,
        is_admin,
        referral_code: referralCode
      }
    });

  } catch (error) {
    console.error('Error in admin create user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
