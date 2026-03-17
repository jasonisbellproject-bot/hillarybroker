import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Optionally, require authentication
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    const { amount, method, address } = await request.json();

    if (!amount || !method || !address) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Map frontend method names to database allowed values
    const methodMapping: { [key: string]: string } = {
      'bitcoin': 'crypto',
      'ethereum': 'crypto', 
      'usdt': 'crypto',
      'bank': 'bank',
      'paypal': 'paypal',
      'card': 'card'
    };

    const dbMethod = methodMapping[method];
    if (!dbMethod) {
      return NextResponse.json({ 
        error: `Invalid withdrawal method. Allowed methods: ${Object.keys(methodMapping).join(', ')}` 
      }, { status: 400 });
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount. Must be greater than 0.' }, { status: 400 });
    }

    // Use the server-side supabase client with session/cookies
    const supabase = await createClient();
    
    // Create service client to bypass RLS for platform settings
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get platform settings for withdrawal limits using service role
    const { data: platformSettings, error: settingsError } = await serviceSupabase
      .from('platform_settings')
      .select('min_withdrawal, max_withdrawal, daily_withdrawal_limit, withdrawal_fee')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Error fetching platform settings:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch platform settings' }, { status: 500 });
    }

    // Use default values if no settings found
    const settings = platformSettings || {
      min_withdrawal: 100,
      max_withdrawal: 25000,
      daily_withdrawal_limit: 10000,
      withdrawal_fee: 5
    };

    // Validate withdrawal amount against platform limits
    if (numAmount < settings.min_withdrawal) {
      return NextResponse.json({ 
        error: `Withdrawal amount must be at least $${settings.min_withdrawal}` 
      }, { status: 400 });
    }

    if (numAmount > settings.max_withdrawal) {
      return NextResponse.json({ 
        error: `Withdrawal amount cannot exceed $${settings.max_withdrawal}` 
      }, { status: 400 });
    }

    // Check daily withdrawal limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: todayWithdrawals, error: dailyError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['approved', 'completed'])
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (dailyError) {
      console.error('Error checking daily withdrawals:', dailyError);
      return NextResponse.json({ error: 'Failed to check daily withdrawal limit' }, { status: 500 });
    }

    const todayTotal = (todayWithdrawals || []).reduce((sum, w) => sum + parseFloat(w.amount), 0);
    const remainingDailyLimit = settings.daily_withdrawal_limit - todayTotal;

    if (numAmount > remainingDailyLimit) {
      return NextResponse.json({ 
        error: `Daily withdrawal limit exceeded. You can withdraw up to $${remainingDailyLimit.toFixed(2)} today.` 
      }, { status: 400 });
    }
    
    // Insert withdrawal request into the database
    const { data, error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount: numAmount,
        method: dbMethod,
        wallet_address: address,
        status: 'pending',
        reference: `WD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Withdrawal creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      await emailService.sendAdminNotificationEmail('withdrawal_request', {
        userFullName,
        userEmail: userData?.email || 'Unknown',
        amount: numAmount,
        method: dbMethod,
        address,
        reference: data.reference
      });
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
      // Don't fail the withdrawal creation if email fails
    }

    console.log('✅ Withdrawal created successfully:', data.id);

    return NextResponse.json({ 
      success: true, 
      withdrawal: data,
      message: 'Withdrawal request submitted successfully. Please wait for admin approval.'
    });
  } catch (e) {
    console.error('Withdrawal creation error:', e);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 