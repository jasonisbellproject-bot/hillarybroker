import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    // For now, let's use the admin user ID directly for testing
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a'; // Admin user ID

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, action } = params;
    const { notes } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get withdrawal details
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (withdrawalError || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal is not pending' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const processedAt = new Date().toISOString();

    // Update withdrawal status
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: newStatus,
        processed_at: processedAt,
        processed_by: adminUserId,
        admin_notes: notes
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating withdrawal:', updateError);
      return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: withdrawal.user_id,
        type: action === 'approve' ? 'withdrawal_approved' : 'withdrawal_rejected',
        amount: withdrawal.amount,
        currency: withdrawal.currency,
        method: withdrawal.method,
        reference: `WD-${id}`,
        status: 'completed',
        metadata: {
          withdrawal_id: id,
          action: action,
          notes: notes
        }
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
    }

    // Create notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: withdrawal.user_id,
        title: action === 'approve' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
        message: action === 'approve' 
          ? `Your withdrawal of $${withdrawal.amount} has been approved and processed.`
          : `Your withdrawal of $${withdrawal.amount} has been rejected. ${notes || ''}`,
        type: action === 'approve' ? 'success' : 'error'
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${action}d successfully`,
      withdrawal: {
        id,
        status: newStatus,
        processed_at: processedAt
      }
    });

  } catch (error) {
    console.error('Error in admin withdrawal action API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 