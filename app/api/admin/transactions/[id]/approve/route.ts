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
    console.log('🔍 Processing transaction approval for ID:', id);
    
    // Check admin authentication
    let auth;
    try {
      auth = await requireAuth(request);
      console.log('✅ Admin authentication successful:', auth.user.id);
    } catch (authError) {
      console.error('❌ Admin authentication failed:', authError);
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const adminUserId = auth.user.id;

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      console.error('❌ Admin verification failed:', userError);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ Admin verification successful');

    // First, let's check if the transaction exists in either table
    console.log('🔍 Looking for transaction with ID:', id);
    
    // Check if it's a withdrawal first
    let { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    console.log('🔍 Withdrawal lookup result:', { withdrawal, withdrawalError });

    // If not found in withdrawals, check deposits
    let deposit = null;
    let depositError = null;
    
    console.log('🔍 Checking if transaction is a deposit...');
    
    if (withdrawalError && withdrawalError.code === 'PGRST116') {
      console.log('🔍 Transaction not found in withdrawals, checking deposits...');
      const depositResult = await supabase
        .from('deposits')
        .select('*')
        .eq('id', id)
        .single();
      
      deposit = depositResult.data;
      depositError = depositResult.error;
      
      console.log('🔍 Deposit lookup result:', { deposit, depositError });

      if (depositError && depositError.code === 'PGRST116') {
        console.error('❌ Transaction not found in either withdrawals or deposits');
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }
    }

    if (!withdrawalError && withdrawal) {
      console.log('✅ Found withdrawal, processing approval...');
      
      // Check if withdrawal is pending
      if (withdrawal.status !== 'pending') {
        console.error('❌ Withdrawal is not pending:', withdrawal.status);
        return NextResponse.json({ 
          error: 'Withdrawal is not pending',
          currentStatus: withdrawal.status 
        }, { status: 400 });
      }
      
      // Check if user has sufficient balance
      const { data: userBalance, error: userBalanceError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', withdrawal.user_id)
        .single();

      if (userBalanceError || !userBalance) {
        console.error('❌ User balance lookup failed:', userBalanceError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('💰 User balance:', userBalance.wallet_balance, 'Withdrawal amount:', withdrawal.amount);

      if (userBalance.wallet_balance < withdrawal.amount) {
        console.error('❌ Insufficient balance');
        return NextResponse.json({ error: 'Insufficient user balance' }, { status: 400 });
      }

      // Update withdrawal status
      const { data: updatedWithdrawal, error: updateError } = await supabase
        .from('withdrawals')
        .update({
          status: 'approved',
          processed_by: adminUserId,
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating withdrawal:', updateError);
        return NextResponse.json({ error: 'Failed to approve withdrawal' }, { status: 500 });
      }

      console.log('✅ Withdrawal status updated successfully');

      // Update user balance (deduct the withdrawal amount)
      const newBalance = userBalance.wallet_balance - withdrawal.amount;
      const { error: balanceError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: newBalance
        })
        .eq('id', withdrawal.user_id);

      if (balanceError) {
        console.error('❌ Error updating user balance:', balanceError);
        // Rollback withdrawal status if balance update fails
        await supabase
          .from('withdrawals')
          .update({ 
            status: 'pending',
            processed_at: null,
            processed_by: null
          })
          .eq('id', id);
        
        return NextResponse.json({ error: 'Failed to update user balance' }, { status: 500 });
      }

      console.log('✅ User balance updated successfully');

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
          console.log('✅ Withdrawal approval email sent');
        }
      } catch (emailError) {
        console.error('⚠️ Withdrawal approved email failed:', emailError);
        // Don't fail the approval if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Withdrawal approved successfully',
        transaction: updatedWithdrawal
      });
    }

    // If not a withdrawal, check if it's a deposit
        if (!withdrawal && deposit) {
      console.log('✅ Found deposit, processing approval...');

      if (deposit.status !== 'pending') {
        console.error('❌ Deposit is not pending:', deposit.status);
        return NextResponse.json({ 
          error: 'Deposit is not pending',
          currentStatus: deposit.status 
        }, { status: 400 });
      }
    } else if (!withdrawal && !deposit) {
      console.error('❌ Transaction not found in either withdrawals or deposits');
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    console.log('📋 Transaction summary:', {
      id,
      type: withdrawal ? 'withdrawal' : 'deposit',
      status: withdrawal ? withdrawal.status : deposit.status,
      amount: withdrawal ? withdrawal.amount : deposit.amount
    });

    // Update deposit status
    const { data: updatedDeposit, error: updateError } = await supabase
      .from('deposits')
      .update({
        status: 'completed'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating deposit:', updateError);
      return NextResponse.json({ error: 'Failed to approve deposit' }, { status: 500 });
    }

    console.log('✅ Deposit status updated successfully');

    // Get current user balance for deposit
    const { data: userBalance, error: userBalanceError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', deposit.user_id)
      .single();

    if (userBalanceError || !userBalance) {
      console.error('❌ User balance lookup failed:', userBalanceError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user balance
    const newBalance = userBalance.wallet_balance + deposit.amount;
    const { error: balanceError } = await supabase
      .from('users')
      .update({ 
        wallet_balance: newBalance
      })
      .eq('id', deposit.user_id);

    if (balanceError) {
      console.error('❌ Error updating user balance:', balanceError);
      // Rollback deposit status if balance update fails
      await supabase
        .from('deposits')
        .update({ 
          status: 'pending'
        })
        .eq('id', id);
      
      return NextResponse.json({ error: 'Failed to update user balance' }, { status: 500 });
    }

    console.log('✅ User balance updated successfully');

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
        console.log('✅ Deposit approval email sent');
      }
    } catch (emailError) {
      console.error('⚠️ Deposit approved email failed:', emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit approved successfully',
      transaction: updatedDeposit
    });

  } catch (error) {
    console.error('❌ Error in admin approve transaction API:', error);
    
    // Return more specific error information
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 