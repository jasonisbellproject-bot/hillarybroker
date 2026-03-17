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
    console.log('Debugging investments for user:', user.id);

    // Get raw investment data without processing
    const { data: rawInvestments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (investmentsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch raw investments',
        details: investmentsError.message,
        code: investmentsError.code,
        success: false
      }, { status: 500 });
    }

    // Check for problematic data
    const problematicInvestments = rawInvestments?.filter(inv => {
      const hasInvalidDates = !inv.start_date || !inv.end_date || 
        isNaN(new Date(inv.start_date).getTime()) || 
        isNaN(new Date(inv.end_date).getTime());
      
      const hasScheduledStatus = inv.status === 'scheduled';
      const hasNullAmount = inv.amount === null || inv.amount === undefined;
      
      return hasInvalidDates || hasScheduledStatus || hasNullAmount;
    }) || [];

    // Get investment plans
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active');

    if (plansError) {
      return NextResponse.json({ 
        error: 'Failed to fetch plans',
        details: plansError.message,
        code: plansError.code,
        success: false
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Debug information',
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      rawInvestments: {
        count: rawInvestments?.length || 0,
        data: rawInvestments || []
      },
      problematicInvestments: {
        count: problematicInvestments.length,
        data: problematicInvestments
      },
      plans: {
        count: plans?.length || 0,
        data: plans || []
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug investments error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 