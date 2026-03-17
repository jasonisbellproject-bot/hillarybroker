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

    // Check if user has sufficient balance
    const { data: user, error: userBalanceError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', withdrawal.user_id)
      .single();

    if (userBalanceError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.wallet_balance < withdrawal.amount) {
      return NextResponse.json({ error: 'Insufficient user balance' }, { status: 400 });
    }

    // Update withdrawal status to approved
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: userId
      })
      .eq('id', withdrawalId);

    if (updateError) {
      console.error('Error updating withdrawal:', updateError);
      return NextResponse.json({ error: 'Failed to approve withdrawal' }, { status: 500 });
    }

    // Update user balance (deduct the withdrawal amount)
    const { error: balanceError } = await supabase
      .from('users')
      .update({ 
        wallet_balance: supabase.raw(`wallet_balance - ${withdrawal.amount}`)
      })
      .eq('id', withdrawal.user_id);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Rollback withdrawal status if balance update fails
      await supabase
        .from('withdrawals')
        .update({ 
          status: 'pending',
          processed_at: null,
          processed_by: null
        })
        .eq('id', withdrawalId);
      
      return NextResponse.json({ error: 'Failed to update user balance' }, { status: 500 });
    }

    // Send withdrawal approved email
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', withdrawal.user_id)
        .single();

      if (userData) {
        await emailService.sendWithdrawalApprovedEmail(
          userData.email,
          userData.first_name,
          withdrawal.amount,
          withdrawal.reference
        );
      }
    } catch (emailError) {
      console.error('Withdrawal approved email failed:', emailError);
      // Don't fail the approval if email fails
    }

    console.log('✅ Withdrawal approved successfully:', withdrawalId);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal approved successfully',
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: 'approved',
        processed_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Withdrawal approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve withdrawal' },
      { status: 500 }
    );
  }
} 