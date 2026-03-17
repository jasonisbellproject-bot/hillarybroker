import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    const user = auth.user;

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, address, network, fee, min_amount, max_amount, processing_time, description, icon } = await request.json();

    // Validate required fields
    if (!name || !type || !address) {
      return NextResponse.json({ error: 'Name, type, and address are required' }, { status: 400 });
    }

    // Update wallet address
    const { data: walletAddress, error } = await supabase
      .from('wallet_addresses')
      .update({
        name,
        type,
        address,
        network,
        fee: fee || 0,
        min_amount: min_amount || 0,
        max_amount: max_amount || 999999,
        processing_time: processing_time || 'Instant',
        description,
        icon: icon || 'wallet'
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating wallet address:', error);
      return NextResponse.json({ 
        error: 'Failed to update wallet address',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, walletAddress });

  } catch (error) {
    console.error('Error in admin wallet address update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request);
    const user = auth.user;

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete wallet address
    const { error } = await supabase
      .from('wallet_addresses')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting wallet address:', error);
      return NextResponse.json({ 
        error: 'Failed to delete wallet address',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in admin wallet address delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 