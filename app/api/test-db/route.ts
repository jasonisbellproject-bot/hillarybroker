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

    // Test database connection
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('count')
      .limit(1);

    if (plansError) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: plansError.message,
        code: plansError.code,
        success: false
      }, { status: 500 });
    }

    // Test investments table
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('count')
      .limit(1);

    if (investmentsError) {
      return NextResponse.json({ 
        error: 'Investments table error',
        details: investmentsError.message,
        code: investmentsError.code,
        success: false
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Database connection successful',
      success: true,
      plansCount: plans?.length || 0,
      investmentsCount: investments?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 