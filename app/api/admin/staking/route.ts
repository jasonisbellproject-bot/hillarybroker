import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // List all staking pools with stats
  const { data, error } = await supabase
    .from('staking_pools')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Add total_users and total_staked for each pool
  const poolsWithStats = await Promise.all((data || []).map(async (pool) => {
    const { count: total_users } = await supabase
      .from('user_stakes')
      .select('id', { count: 'exact', head: true })
      .eq('pool_id', pool.id);
    const { data: stakes } = await supabase
      .from('user_stakes')
      .select('amount')
      .eq('pool_id', pool.id);
    const total_staked = stakes?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;
    return { ...pool, total_users: total_users || 0, total_staked };
  }));
  return NextResponse.json(poolsWithStats);
}

export async function POST(request: NextRequest) {
  // Create a new staking pool
  const body = await request.json();
  const { name, description, apy, min_stake, max_stake, lock_period, features } = body;
  if (!name || !apy || !min_stake || !max_stake || !lock_period) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('staking_pools')
    .insert({
      name,
      description,
      apy,
      min_stake,
      max_stake,
      lock_period,
      features: features || [],
      status: 'active',
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  // Edit a staking pool
  const body = await request.json();
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: 'Missing pool id' }, { status: 400 });
  const { data, error } = await supabase
    .from('staking_pools')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  // Delete a staking pool
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing pool id' }, { status: 400 });
  const { error } = await supabase
    .from('staking_pools')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 