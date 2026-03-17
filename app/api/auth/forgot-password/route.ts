import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    console.log('Password reset request for:', email);

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not for security
      console.log('Password reset requested for non-existent email:', email);
      return NextResponse.json({ 
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link.' 
      });
    }

    // Build base URL for redirects (prefer configured site URL)
    const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || request.nextUrl.origin;
    const baseUrl = (rawBaseUrl || '').replace(/\/$/, '');

    // Send password reset email using Supabase Auth
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    if (resetError) {
      console.error('Password reset error:', resetError);
      return NextResponse.json({ 
        error: 'Failed to send password reset email. Please try again.' 
      }, { status: 500 });
    }

    // Also send our custom email template
    try {
      await emailService.sendPasswordResetEmail(email, user.first_name || 'User');
      console.log('Custom password reset email sent to:', email);
    } catch (emailError) {
      console.error('Custom email sending failed:', emailError);
      // Don't fail the request if custom email fails, Supabase email still works
    }

    console.log('Password reset email sent successfully to:', email);

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent successfully.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
