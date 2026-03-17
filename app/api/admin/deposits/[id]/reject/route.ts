import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';
import { emailService } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const depositId = params.id;
    const { reason } = await request.json();
    
    if (!depositId) {
      return NextResponse.json({ error: 'Deposit ID is required' }, { status: 400 });
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

    // Get the deposit
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (depositError || !deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit is not pending' }, { status: 400 });
    }

    // Update deposit status to failed
    const { error: updateError } = await supabase
      .from('deposits')
      .update({ 
        status: 'failed',
        processed_at: new Date().toISOString(),
        approved_by: userId,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || 'Rejected by admin'
      })
      .eq('id', depositId);

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

    console.log('✅ Deposit rejected successfully:', depositId);

    return NextResponse.json({
      success: true,
      message: 'Deposit rejected successfully',
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: 'failed',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason || 'Rejected by admin'
      }
    });

  } catch (error: any) {
    console.error('Deposit rejection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject deposit' },
      { status: 500 }
    );
  }
} 