import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        success: false
      }, { status: 500 });
    }

    // Create Supabase client
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
              // Ignore
            }
          },
        },
      }
    )

    // Get the current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return NextResponse.json({ 
        error: 'Session error',
        details: sessionError.message,
        success: false
      }, { status: 401 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'No authenticated user found',
        success: false
      }, { status: 401 });
    }

    const user = session.user;
    console.log('Testing with user:', user.id);

    // Test the exact query from the investment API
    const { data: investments, error, count } = await supabase
      .from('investments')
      .select(`
        *,
        investment_plans(name, description, daily_return, duration, total_return)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        error: 'Investment query failed',
        details: error.message,
        code: error.code,
        success: false
      }, { status: 500 });
    }

    // Test investment plans query
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active')
      .order('min_amount', { ascending: true });

    if (plansError) {
      return NextResponse.json({ 
        error: 'Plans query failed',
        details: plansError.message,
        code: plansError.code,
        success: false
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Investment API test successful',
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      investments: {
        count: investments?.length || 0,
        data: investments || []
      },
      plans: {
        count: plans?.length || 0,
        data: plans || []
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test investment auth error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 