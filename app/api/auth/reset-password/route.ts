import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validate input
    if (!password) {
      return NextResponse.json({ 
        error: 'Password is required' 
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }

    console.log('Password reset request received');

    // Get the access token from the request headers or cookies
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '') ||
                       request.cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'No access token provided' 
      }, { status: 401 });
    }

    // Create a client with the access token to get the user session
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    // Get the current user session
    const { data: { user }, error: sessionError } = await userSupabase.auth.getUser();

    if (sessionError || !user) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ 
        error: 'Invalid or expired session. Please request a new password reset link.' 
      }, { status: 401 });
    }

    console.log('User session verified:', user.id);

    // Update the user's password using Supabase Auth admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update password. Please try again.' 
      }, { status: 500 });
    }

    console.log('Password updated successfully for user:', user.id);

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
