import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // List all user stakes with user and pool info
  const { data, error } = await supabase
    .from('user_stakes')
    .select('*, users: user_id (email), staking_pools: pool_id (name)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  // Update a user stake
  const { id, ...update } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing stake id' }, { status: 400 });
  const { data, error } = await supabase
    .from('user_stakes')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
} 