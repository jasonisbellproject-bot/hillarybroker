import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({
        name,
        description,
        min_amount: minInvestment,
        max_amount: maxInvestment,
        daily_return: dailyReturn,
        duration,
        total_return: totalReturn,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating investment plan:', error);
      return NextResponse.json({ error: 'Failed to update investment plan' }, { status: 500 });
    }

    if (!plan) {
      return NextResponse.json({ error: 'Investment plan not found' }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in update investment plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if there are any active investments in this plan
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('id')
      .eq('plan_id', params.id)
      .eq('status', 'active');

    if (investmentsError) {
      console.error('Error checking investments:', investmentsError);
      return NextResponse.json({ error: 'Failed to check investments' }, { status: 500 });
    }

    if (investments && investments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete plan with active investments' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('investment_plans')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting investment plan:', error);
      return NextResponse.json({ error: 'Failed to delete investment plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete investment plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 