import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin logout requested');

    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin logout successful' 
    });

    // Clear admin session cookies
    response.cookies.set('sb-access-token', '', { 
      maxAge: 0, 
      path: '/' 
    });
    response.cookies.set('sb-refresh-token', '', { 
      maxAge: 0, 
      path: '/' 
    });
    response.cookies.set('admin-session', '', { 
      maxAge: 0, 
      path: '/' 
    });

    console.log('🔐 Admin session cookies cleared');

    return response;

  } catch (error) {
    console.error('🔐 Unexpected error in admin logout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 