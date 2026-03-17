import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 /api/debug-auth - Endpoint called');
  
  // Log all request details
  const cookies = Array.from(request.cookies.entries());
  const headers = Array.from(request.headers.entries());
  
  console.log('🔍 Request cookies:', cookies.map(([name, value]) => `${name}: ${value.value ? 'present' : 'missing'}`));
  console.log('🔍 Request headers:', headers.map(([name, value]) => `${name}: ${value}`));
  
  return NextResponse.json({
    message: 'Debug endpoint working',
    cookies: cookies.map(([name, value]) => ({ name, present: !!value.value })),
    headers: headers.map(([name, value]) => ({ name, value }))
  });
} 