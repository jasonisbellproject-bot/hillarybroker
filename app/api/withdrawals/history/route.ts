import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    // Use the server-side supabase client with session/cookies
    const supabase = await createClient();
    // Fetch withdrawal history
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawal history:', error);
      return NextResponse.json({ error: 'Failed to fetch withdrawal history' }, { status: 500 });
    }

    return NextResponse.json(withdrawals || []);
  } catch (error) {
    console.error('Error in withdrawal history API:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 