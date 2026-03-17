import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing environment variables');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Missing Supabase environment variables'
      }, { status: 500 });
    }

    // Create Supabase client with SSR
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get the current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    if (!session?.user?.id) {
      console.log('No authenticated user found')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = session.user;

    // Get filter parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query for user's investments
    let query = supabase
      .from('investments')
      .select(`
        *,
        investment_plans(name, description, daily_return, duration, total_return)
      `, { count: 'exact' })
      .eq('user_id', user.id);

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: investments, error, count } = await query;

    if (error) {
      console.error('Error fetching user investments:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch investments',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    // Format investments for the frontend
    const formattedInvestments = investments?.map(investment => {
      try {
        console.log('Processing investment:', investment.id);
        
        const startDate = new Date(investment.start_date);
        const endDate = new Date(investment.end_date);
        const now = new Date();
        
        // Check for valid dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid dates for investment:', investment.id, {
            start_date: investment.start_date,
            end_date: investment.end_date
          });
          return null;
        }
        
        const progress = Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
        
        // Use plan data if available, otherwise use investment data
        const plan = investment.investment_plans;
        const dailyReturn = plan?.daily_return || investment.daily_return || 0;
        const duration = plan?.duration || 30;
        const totalReturn = investment.amount * (dailyReturn * duration / 100);
        const earnedSoFar = investment.amount * (dailyReturn * (progress / 100) / 100);

        return {
          id: investment.id,
          planName: plan?.name || 'Unknown Plan',
          planDescription: plan?.description || '',
          amount: investment.amount,
          dailyReturn: dailyReturn,
          totalReturn: totalReturn,
          earnedSoFar: earnedSoFar,
          startDate: investment.start_date,
          endDate: investment.end_date,
          status: investment.status,
          progress: Math.round(progress)
        };
      } catch (error) {
        console.error('Error processing investment:', investment.id, error);
        return null;
      }
    }).filter(Boolean) || [];

    // Calculate stats for the user
    const totalInvested = formattedInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const activeInvestments = formattedInvestments.filter(inv => inv.status === 'active').length;
    const totalEarnings = formattedInvestments.reduce((sum, inv) => sum + inv.earnedSoFar, 0);
    const averageReturn = formattedInvestments.length > 0 ? (totalEarnings / formattedInvestments.length) : 0;

    const stats = {
      totalInvested: Math.round(totalInvested * 100) / 100,
      activeInvestments,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
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
    console.error('Error in user investments API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing environment variables');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Missing Supabase environment variables'
      }, { status: 500 });
    }

    // Create Supabase client with SSR
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get the current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    if (!session?.user?.id) {
      console.log('No authenticated user found')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = session.user;
    const { planId, amount } = await request.json();

    // Validate input
    if (!planId || !amount) {
      return NextResponse.json({ error: 'Plan ID and amount are required' }, { status: 400 });
    }

    // Get the investment plan
    const { data: plan, error: planError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .eq('status', 'active')
      .single();

    if (planError || !plan) {
      console.error('Plan error:', planError);
      return NextResponse.json({ 
        error: 'Invalid investment plan',
        details: planError?.message 
      }, { status: 400 });
    }

    // Validate amount
    if (amount < plan.min_amount || amount > plan.max_amount) {
      return NextResponse.json({ 
        error: `Amount must be between $${plan.min_amount} and $${plan.max_amount}` 
      }, { status: 400 });
    }

    // Check user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('User error:', userError);
      return NextResponse.json({ 
        error: 'Failed to get user data',
        details: userError.message 
      }, { status: 500 });
    }

    if (!userData || userData.wallet_balance < amount) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        details: `Available: $${userData?.wallet_balance || 0}, Required: $${amount}`
      }, { status: 400 });
    }

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
    const status = 'active';

    // Create investment
    const { data: investment, error: investmentError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: amount,
        daily_return: plan.daily_return,
        total_return: plan.total_return,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: status
      })
      .select()
      .single();

    if (investmentError) {
      console.error('Error creating investment:', investmentError);
      return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
    }

    // Deduct amount from user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ wallet_balance: userData.wallet_balance - amount })
      .eq('id', user.id);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'investment',
        amount: amount,
        currency: 'USD',
        method: plan.name,
        reference: `INV-${investment.id}`,
        status: 'completed',
        metadata: { plan_id: planId, investment_id: investment.id }
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      investment
    });

  } catch (error) {
    console.error('Error in create investment API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 