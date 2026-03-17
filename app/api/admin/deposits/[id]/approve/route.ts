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

    // Update deposit status to completed
    const { error: updateError } = await supabase
      .from('deposits')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString(),
        approved_by: userId,
        approved_at: new Date().toISOString()
      })
      .eq('id', depositId);

    if (updateError) {
      console.error('Error updating deposit:', updateError);
      return NextResponse.json({ error: 'Failed to approve deposit' }, { status: 500 });
    }

    // Update user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ 
        wallet_balance: supabase.raw(`wallet_balance + ${deposit.amount}`)
      })
      .eq('id', deposit.user_id);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Rollback deposit status if balance update fails
      await supabase
        .from('deposits')
        .update({ 
          status: 'pending',
          processed_at: null,
          approved_by: null,
          approved_at: null
        })
        .eq('id', depositId);
      
      return NextResponse.json({ error: 'Failed to update user balance' }, { status: 500 });
    }

    // Send deposit approved email
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', deposit.user_id)
        .single();

      if (userData) {
        await emailService.sendDepositApprovedEmail(
          userData.email,
          userData.first_name,
          deposit.amount,
          deposit.reference
        );
      }
    } catch (emailError) {
      console.error('Deposit approved email failed:', emailError);
      // Don't fail the approval if email fails
    }

    console.log('✅ Deposit approved successfully:', depositId);

    return NextResponse.json({
      success: true,
      message: 'Deposit approved successfully',
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: 'completed',
        approved_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Deposit approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve deposit' },
      { status: 500 }
    );
  }
} 