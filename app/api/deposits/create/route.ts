import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { amount, method, transactionHash, paymentProof, walletAddress } = await request.json();
    
    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    if (!method) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }
    
    if (!transactionHash) {
      return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 });
    }

    const auth = await requireAuth(request);
    const userId = auth.user.id;

    const supabase = await createClient();
    
    // Create service client to bypass RLS for platform settings
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get platform settings for deposit limits using service role
    const { data: platformSettings, error: settingsError } = await serviceSupabase
      .from('platform_settings')
      .select('min_deposit, max_deposit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Error fetching platform settings:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch platform settings' }, { status: 500 });
    }

    // Use default values if no settings found
    const settings = platformSettings || {
      min_deposit: 50,
      max_deposit: 50000
    };

    // Validate deposit amount against platform limits
    if (amount < settings.min_deposit) {
      return NextResponse.json({ 
        error: `Deposit amount must be at least $${settings.min_deposit}` 
      }, { status: 400 });
    }

    if (amount > settings.max_deposit) {
      return NextResponse.json({ 
        error: `Deposit amount cannot exceed $${settings.max_deposit}` 
      }, { status: 400 });
    }

    // Create deposit record with pending status
    const { data: deposit, error } = await supabase
      .from('deposits')
      .insert({
        user_id: userId,
        amount: amount,
        currency: 'USD',
        payment_method: method,
        status: 'pending', // Always start as pending
        reference: `DEP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        transaction_hash: transactionHash
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating deposit:', error);
      return NextResponse.json({ error: 'Failed to create deposit' }, { status: 500 });
    }

    // Send admin notification email
    try {
      // Get user details for the notification
      const { data: userData } = await supabase
        .from('users')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();

      const userFullName = userData ? `${userData.first_name} ${userData.last_name}` : 'User';
      
      // Send notification to admin emails from environment variables
      await emailService.sendAdminNotificationEmail('deposit_request', {
        userFullName,
        userEmail: userData?.email || 'Unknown',
        amount: amount,
        method: method,
        transactionHash: transactionHash,
        reference: deposit.reference
      });
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
      // Don't fail the deposit creation if email fails
    }

    console.log('✅ Deposit created successfully:', deposit.id);

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        method: deposit.payment_method,
        status: deposit.status,
        reference: deposit.reference,
        created_at: deposit.created_at
      },
      message: 'Deposit submitted successfully. Please wait for admin approval.'
    });

  } catch (error: any) {
    console.error('Deposit creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create deposit' },
      { status: 500 }
    );
  }
} 