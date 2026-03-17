import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    console.log('Login attempt for:', email);

    // Create Supabase SSR client
    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signin error:', authError);
      
      // Handle specific error cases
      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json({ 
          error: 'Please check your email and click the confirmation link before signing in.' 
        }, { status: 401 });
      }
      
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json({ 
          error: 'Invalid email or password. Please check your credentials and try again.' 
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: authError.message || 'Invalid email or password' 
      }, { status: 401 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Authentication failed' 
      }, { status: 401 });
    }

    console.log('Authentication successful for user:', authData.user.id);

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ 
        error: 'Failed to fetch user profile' 
      }, { status: 500 });
    }

    console.log('User profile fetched successfully');

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        referral_code: userProfile.referral_code,
        total_earned: userProfile.total_earned,
        total_staked: userProfile.total_staked,
        wallet_balance: userProfile.wallet_balance,
        kyc_verified: userProfile.kyc_verified,
        is_admin: userProfile.is_admin
      }
    });

    // Set session cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    response.cookies.set('sb-access-token', authData.session.access_token, cookieOptions);
    response.cookies.set('sb-refresh-token', authData.session.refresh_token, cookieOptions);
    
    // Set admin session cookie if user is admin
    if (userProfile.is_admin) {
      response.cookies.set('admin-session', 'true', cookieOptions);
    }

    console.log('Login API response ready');
    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 