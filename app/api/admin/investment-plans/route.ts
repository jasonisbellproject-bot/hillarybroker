import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: plans, error } = await supabase
      .from('investment_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching investment plans:', error);
      return NextResponse.json({ error: 'Failed to fetch investment plans' }, { status: 500 });
    }

    return NextResponse.json({ plans: plans || [] });
  } catch (error) {
    console.error('Error in investment plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, minInvestment, maxInvestment, dailyReturn, duration, status } = await request.json();

    // Validate required fields
    if (!name || !description || !minInvestment || !maxInvestment || !dailyReturn || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate numeric values
    if (minInvestment <= 0 || maxInvestment <= 0 || dailyReturn <= 0 || duration <= 0) {
      return NextResponse.json({ error: 'All numeric values must be positive' }, { status: 400 });
    }

    if (minInvestment >= maxInvestment) {
      return NextResponse.json({ error: 'Minimum investment must be less than maximum investment' }, { status: 400 });
    }

    // Calculate total return based on daily return and duration
    const totalReturn = (dailyReturn * duration) + 100;

    const { data: plan, error } = await supabase
      .from('investment_plans')
      .insert({
        name,
        description,
        min_amount: minInvestment,
        max_amount: maxInvestment,
        daily_return: dailyReturn,
        duration,
        total_return: totalReturn,
        status: status || 'active',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating investment plan:', error);
      return NextResponse.json({ error: 'Failed to create investment plan' }, { status: 500 });
    }

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Error in create investment plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 