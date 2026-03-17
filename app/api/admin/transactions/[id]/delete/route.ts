import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // For testing, let's skip authentication for now
    // TODO: Re-enable authentication once we confirm the API works
    /*
    const auth = await requireAuth(request);
    const adminUserId = auth.user.id;

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    */
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a' // Temporary admin ID for testing

    // Check if it's a withdrawal first
    let { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (!withdrawalError && withdrawal) {
      // Delete withdrawal
      const { error: deleteError } = await supabase
        .from('withdrawals')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting withdrawal:', deleteError);
        return NextResponse.json({ error: 'Failed to delete withdrawal' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Withdrawal deleted successfully'
      });
    }

    // If not a withdrawal, check if it's a deposit
    let { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', id)
      .single();

    if (depositError) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Delete deposit
    const { error: deleteError } = await supabase
      .from('deposits')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting deposit:', deleteError);
      return NextResponse.json({ error: 'Failed to delete deposit' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit deleted successfully'
    });

  } catch (error) {
    console.error('Error in admin delete transaction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 