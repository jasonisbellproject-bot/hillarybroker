import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Use service role key for admin checks
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return NextResponse.json({ error: 'Failed to check admin status' }, { status: 500 });
    }

    return NextResponse.json({ is_admin: user?.is_admin || false });
  } catch (error) {
    console.error('Unexpected error in check-admin API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 