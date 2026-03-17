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

    // Fetch all active investment plans
    const { data: plans, error } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active')
      .order('min_amount', { ascending: true });

    if (error) {
      console.error('Error fetching investment plans:', error);
      return NextResponse.json({ error: 'Failed to fetch investment plans' }, { status: 500 });
    }

    return NextResponse.json(plans || []);
  } catch (error) {
    console.error('Investment plans API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { planId, amount } = await request.json();

    // Validate input
    if (!planId || !amount) {
      return NextResponse.json({ error: 'Plan ID and amount are required' }, { status: 400 });
    }

    // Create Supabase client with SSR
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    const userId = session.user.id;

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .eq('status', 'active')
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Validate amount
    if (amount < plan.min_amount || amount > plan.max_amount) {
      return NextResponse.json({ 
        error: `Amount must be between $${plan.min_amount} and $${plan.max_amount}` 
      }, { status: 400 });
    }

    // Check user balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user balance:', userError);
      return NextResponse.json({ error: 'Failed to fetch user balance' }, { status: 500 });
    }

    if (user.wallet_balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate investment details
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
    const dailyReturn = (amount * plan.daily_return) / 100;
    const totalReturn = (amount * plan.total_return) / 100;

    // Create investment
    const { data: investment, error } = await supabase
      .from('investments')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount: amount,
        daily_return: dailyReturn,
        total_return: totalReturn,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating investment:', error);
      return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
    }

    // Update user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ wallet_balance: user.wallet_balance - amount })
      .eq('id', userId);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Note: In production, you might want to rollback the investment creation
    }

    return NextResponse.json({ success: true, investment });
  } catch (error) {
    console.error('Error in create investment API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 