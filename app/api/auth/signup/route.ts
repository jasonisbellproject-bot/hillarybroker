import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, referralCode } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ 
        error: 'First name, last name, email, and password are required' 
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return NextResponse.json({ 
        error: authError.message || 'Failed to create account' 
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Failed to create user account' 
      }, { status: 500 });
    }

    // Generate referral code
    const { data: referralCodeData } = await supabase.rpc('generate_referral_code');
    const userReferralCode = referralCodeData || Math.random().toString(36).substring(2, 10).toUpperCase();

    // Find referrer if referral code provided
    let referrerId = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        first_name: firstName,
        last_name: lastName,
        referral_code: userReferralCode,
        referred_by: referrerId,
        kyc_verified: false,
        two_factor_enabled: false,
        is_admin: false,
        total_earned: 0,
        total_staked: 0,
        wallet_balance: 0,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ 
        error: 'Failed to create user profile' 
      }, { status: 500 });
    }

    // Create referral relationship if referrer exists
    if (referrerId) {
      await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referred_id: authData.user.id,
          level: 1,
          commission_earned: 500.00,
          status: 'active'
        });

      // Give welcome bonus to new user
      await supabase
        .from('rewards')
        .insert({
          user_id: authData.user.id,
          type: 'bonus',
          amount: 50.00,
          source: 'signup',
          description: 'Welcome bonus for new user',
          status: 'pending'
        });

      // Give referral bonus to referrer (tracked as referral earnings)
      await supabase
        .from('rewards')
        .insert({
          user_id: referrerId,
          type: 'referral',
          amount: 500.00,
          source: `referral_${authData.user.id}`,
          description: 'Referral bonus for new user signup',
          status: 'pending' // Keep as pending until user claims it
        });

      // Create notification for referrer
      await supabase
        .from('notifications')
        .insert({
          user_id: referrerId,
          title: 'Referral Bonus Earned!',
          message: `Congratulations! You earned $500 for referring a new user. Claim your reward in the Rewards section.`,
          type: 'success'
        });

      // Send referral bonus email to referrer
      try {
        const { data: referrerData } = await supabase
          .from('users')
          .select('email, first_name')
          .eq('id', referrerId)
          .single();

        if (referrerData) {
          await emailService.sendReferralBonusEmail(
            referrerData.email,
            referrerData.first_name,
            500,
            `${firstName} ${lastName}`
          );
        }
      } catch (emailError) {
        console.error('Referral bonus email failed:', emailError);
        // Don't fail the signup if email fails
      }
    } else {
      // Give welcome bonus to new user without referral
      await supabase
        .from('rewards')
        .insert({
          user_id: authData.user.id,
          type: 'bonus',
          amount: 25.00,
          source: 'signup',
          description: 'Welcome bonus for new user',
          status: 'pending'
        });
    }

    // Create welcome notification
    await supabase
      .from('notifications')
      .insert({
        user_id: authData.user.id,
        title: 'Welcome to Clearway Capital!',
        message: `Welcome ${firstName}! Your account has been created successfully. Start earning with our staking pools!`,
        type: 'success'
      });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        referral_code: userReferralCode
      },
      message: 'Account created successfully! Check your email to verify your account.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 