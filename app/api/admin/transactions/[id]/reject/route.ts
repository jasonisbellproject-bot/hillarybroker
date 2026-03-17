import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();
    
    // Check admin authentication
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

    // Check if it's a withdrawal first
    let { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (!withdrawalError && withdrawal) {
      if (withdrawal.status !== 'pending') {
        return NextResponse.json({ error: 'Withdrawal is not pending' }, { status: 400 });
      }

      // Update withdrawal status
      const { data: updatedWithdrawal, error: updateError } = await supabase
        .from('withdrawals')
        .update({
          status: 'rejected',
          processed_by: adminUserId,
          processed_at: new Date().toISOString(),
          admin_notes: reason || 'Rejected by admin'
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating withdrawal:', updateError);
        return NextResponse.json({ error: 'Failed to reject withdrawal' }, { status: 500 });
      }

      // Send withdrawal rejected email
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('email, first_name')
          .eq('id', withdrawal.user_id)
          .single();

        if (userData) {
          await emailService.sendWithdrawalRejectedEmail(
            userData.email,
            userData.first_name,
            withdrawal.amount,
            withdrawal.reference,
            reason || 'Rejected by admin'
          );
        }
      } catch (emailError) {
        console.error('Withdrawal rejected email failed:', emailError);
        // Don't fail the rejection if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Withdrawal rejected successfully',
        transaction: updatedWithdrawal
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

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit is not pending' }, { status: 400 });
    }

    // Update deposit status
    const { data: updatedDeposit, error: updateError } = await supabase
      .from('deposits')
      .update({
        status: 'failed',
        processed_at: new Date().toISOString(),
        approved_by: adminUserId,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || 'Rejected by admin'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating deposit:', updateError);
      return NextResponse.json({ error: 'Failed to reject deposit' }, { status: 500 });
    }

    // Send deposit rejected email
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', deposit.user_id)
        .single();

      if (userData) {
        await emailService.sendDepositRejectedEmail(
          userData.email,
          userData.first_name,
          deposit.amount,
          deposit.reference,
          reason || 'Rejected by admin'
        );
      }
    } catch (emailError) {
      console.error('Deposit rejected email failed:', emailError);
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit rejected successfully',
      transaction: updatedDeposit
    });

  } catch (error) {
    console.error('Error in admin reject transaction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 