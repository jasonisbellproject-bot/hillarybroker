import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Fetch all active investment plans without authentication
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