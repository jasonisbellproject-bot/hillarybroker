import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all deposits with user information
    const { data: deposits, error } = await supabase
      .from('deposits')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deposits:', error);
      return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
    }

    return NextResponse.json(deposits || []);
  } catch (error) {
    console.error('Unexpected error in admin deposits API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 