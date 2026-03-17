import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use service role key for admin authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('🔐 Admin login attempt for:', email);

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log('🔐 Admin auth error:', authError.message);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('🔐 Admin authentication successful for user:', authData.user.id);

    // Check if user is admin using service role (bypasses RLS)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.log('🔐 Error checking admin status:', userError.message);
      // Try alternative approach - check by email
      const { data: userByEmail, error: emailError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', email)
        .single();
      
      if (emailError || !userByEmail?.is_admin) {
        console.log('🔐 User is not admin:', email);
        return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
      }
      
      console.log('🔐 Admin status confirmed by email for user:', email);
    } else if (!user?.is_admin) {
      console.log('🔐 User is not admin:', authData.user.id);
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    } else {
      console.log('🔐 Admin status confirmed for user:', authData.user.id);
    }

    // Create response with admin session cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        is_admin: true
      }
    });

    // Set admin-specific session cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    response.cookies.set('sb-access-token', authData.session.access_token, cookieOptions);
    response.cookies.set('sb-refresh-token', authData.session.refresh_token, cookieOptions);
    response.cookies.set('admin-session', 'true', cookieOptions);

    console.log('🔐 Admin session cookies set successfully');

    return response;

  } catch (error) {
    console.error('🔐 Unexpected error in admin login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 