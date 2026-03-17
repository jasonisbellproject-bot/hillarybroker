import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 /api/test-auth - Endpoint called');
  
  // Log all cookies
  const cookies = Array.from(request.cookies.entries());
  console.log('🔍 All cookies:', cookies.map(([name, value]) => `${name}: ${value.value ? 'present' : 'missing'}`));
  
  // Check for session cookies
  const sessionCookie = request.cookies.get('sb-lcsjasppmrofkuimtpqv-auth-token')?.value;
  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  
  console.log('🔍 Session cookie:', !!sessionCookie);
  console.log('🔍 Access token:', !!accessToken);
  console.log('🔍 Refresh token:', !!refreshToken);
  
  return NextResponse.json({
    message: 'Test endpoint working',
    hasSessionCookie: !!sessionCookie,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    cookies: cookies.map(([name]) => name)
  });
} 