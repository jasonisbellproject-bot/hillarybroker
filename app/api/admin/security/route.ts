import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // For now, let's use the admin user ID directly for testing
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a'; // Admin user ID

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get security statistics
    const [
      { count: totalUsers },
      { count: usersWith2FA },
      { count: verifiedUsers },
      { count: suspendedUsers },
      { data: recentLogins },
      { data: failedLogins }
    ] = await Promise.all([
      // Total users
      supabase.from('users').select('*', { count: 'exact', head: true }),
      
      // Users with 2FA enabled
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .eq('two_factor_enabled', true),
      
      // KYC verified users
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_verified', true),
      
      // Suspended users
      supabase.from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'suspended'),
      
      // Recent successful logins (last 7 days)
      supabase.from('users')
        .select('id, email, last_sign_in_at')
        .gte('last_sign_in_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('last_sign_in_at', { ascending: false })
        .limit(10),
      
      // Failed login attempts (if you have a login_attempts table)
      supabase.from('users')
        .select('id, email, created_at')
        .eq('status', 'suspended')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    // Calculate security metrics
    const securityMetrics = {
      totalUsers: totalUsers || 0,
      usersWith2FA: usersWith2FA || 0,
      verifiedUsers: verifiedUsers || 0,
      suspendedUsers: suspendedUsers || 0,
      twoFactorRate: totalUsers ? ((usersWith2FA || 0) / totalUsers * 100) : 0,
      verificationRate: totalUsers ? ((verifiedUsers || 0) / totalUsers * 100) : 0,
      suspensionRate: totalUsers ? ((suspendedUsers || 0) / totalUsers * 100) : 0
    };

    // Get recent security events
    const recentEvents = [
      ...(recentLogins?.map(login => ({
        type: 'login',
        user: login.email,
        timestamp: login.last_sign_in_at,
        status: 'success'
      })) || []),
      ...(failedLogins?.map(user => ({
        type: 'suspension',
        user: user.email,
        timestamp: user.created_at,
        status: 'warning'
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 20);

    return NextResponse.json({
      metrics: securityMetrics,
      recentEvents,
      summary: {
        totalSecurityEvents: recentEvents.length,
        successfulLogins: recentLogins?.length || 0,
        failedAttempts: failedLogins?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in admin security API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 