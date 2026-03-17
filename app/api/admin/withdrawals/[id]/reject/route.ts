import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';
import { emailService } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const withdrawalId = params.id;
    const { reason } = await request.json();
    
    if (!withdrawalId) {
      return NextResponse.json({ error: 'Withdrawal ID is required' }, { status: 400 });
    }

    const auth = await requireAuth(request);
    const userId = auth.user.id;

    const supabase = await createClient();

    // Check if user is admin
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (userError || !userProfile?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Get the withdrawal
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (withdrawalError || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal is not pending' }, { status: 400 });
    }

    // Update withdrawal status to rejected
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'rejected',
        processed_at: new Date().toISOString(),
        processed_by: userId,
        admin_notes: reason || 'Rejected by admin'
      })
      .eq('id', withdrawalId);

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

    console.log('✅ Withdrawal rejected successfully:', withdrawalId);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal rejected successfully',
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        admin_notes: reason || 'Rejected by admin'
      }
    });

  } catch (error: any) {
    console.error('Withdrawal rejection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject withdrawal' },
      { status: 500 }
    );
  }
} 