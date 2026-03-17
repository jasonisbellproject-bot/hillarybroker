import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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

    const userId = session.user.id
    console.log('Investments API called with userId:', userId)

    // Fetch user investments with plan details
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        id,
        amount,
        daily_return,
        total_return,
        start_date,
        end_date,
        status,
        created_at,
        investment_plans (
          id,
          name,
          min_amount,
          max_amount,
          daily_return,
          duration,
          total_return
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError)
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    }

    // Format investments
    const formattedInvestments = investments?.map(investment => ({
      id: investment.id,
      amount: investment.amount,
      dailyReturn: investment.daily_return,
      totalReturn: investment.total_return,
      startDate: investment.start_date,
      endDate: investment.end_date,
      status: investment.status,
      createdAt: investment.created_at,
      planName: investment.investment_plans?.name || 'Custom Plan',
      planDuration: investment.investment_plans?.duration || 30,
      planDailyReturn: investment.investment_plans?.daily_return || investment.daily_return,
      progress: investment.status === 'active' ? 
        Math.min(100, ((new Date().getTime() - new Date(investment.start_date).getTime()) / 
        (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime())) * 100) : 100
    })) || []

    // Calculate summary stats
    const activeInvestments = formattedInvestments.filter(inv => inv.status === 'active')
    const completedInvestments = formattedInvestments.filter(inv => inv.status === 'completed')
    
    const totalInvested = formattedInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const totalEarnings = completedInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0)
    const activeAmount = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const averageReturn = activeInvestments.length > 0 ? 
      activeInvestments.reduce((sum, inv) => sum + inv.planDailyReturn, 0) / activeInvestments.length : 0

    console.log('Returning investments:', formattedInvestments.length)
    return NextResponse.json({
      investments: formattedInvestments,
      summary: {
        totalInvested,
        totalEarnings,
        activeAmount,
        activeCount: activeInvestments.length,
        completedCount: completedInvestments.length,
        averageReturn
      }
    })
  } catch (error) {
    console.error('Investments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const userId = session.user.id
    const body = await request.json()
    const { planId, amount } = body

    if (!planId || !amount) {
      return NextResponse.json({ error: 'Plan ID and amount are required' }, { status: 400 })
    }

    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get investment plan details
    const { data: plan, error: planError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Investment plan not found' }, { status: 404 })
    }

    // Validate amount against plan limits
    if (amountNum < plan.min_amount || amountNum > plan.max_amount) {
      return NextResponse.json({ 
        error: `Amount must be between $${plan.min_amount} and $${plan.max_amount}` 
      }, { status: 400 })
    }

    // Calculate investment details
    const dailyReturn = (amountNum * plan.daily_return) / 100
    const totalReturn = (amountNum * plan.total_return) / 100
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.duration)

    // Create investment
    const { data: investment, error: investmentError } = await supabase
      .from('investments')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount: amountNum,
        daily_return: dailyReturn,
        total_return: totalReturn,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
      })
      .select()
      .single()

    if (investmentError) {
      console.error('Error creating investment:', investmentError)
      return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 })
    }

    console.log('Investment created:', investment)
    return NextResponse.json({ 
      success: true, 
      investment,
      message: 'Investment created successfully'
    })

  } catch (error) {
    console.error('Create investment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 