import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the current session using Supabase's SSR client
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Middleware - Error getting session:', error);
  }

  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/staking',
    '/rewards',
    '/referrals',
    '/withdrawals',
    '/profile',
    '/settings'
  ];

  // Define admin routes (excluding admin login)
  const adminRoutes = [
    '/admin'
  ];

  // Define admin login routes (should not be protected)
  const adminLoginRoutes = [
    '/admin-login'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAdminLoginRoute = adminLoginRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    console.log('Middleware - Redirecting to login (no session)');
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing admin route (but not admin login), require authentication and admin privileges
  if (isAdminRoute && !isAdminLoginRoute) {
    if (!session) {
      console.log('Middleware - Redirecting unauthenticated user from admin route');
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    console.log('Middleware - Checking admin status for user:', session.user.id);
    
    // Check for admin session cookie first
    const adminSession = request.cookies.get('admin-session')?.value;
    
    if (!adminSession) {
      console.log('Middleware - No admin session, redirecting to admin login');
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      return NextResponse.redirect(url);
    }

    // Additional admin status check via API endpoint
    try {
      const adminCheckResponse = await fetch(`${request.nextUrl.origin}/api/admin/check-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (adminCheckResponse.ok) {
        const { is_admin } = await adminCheckResponse.json();
        
        if (is_admin) {
          console.log('Middleware - Admin access granted');
        } else {
          console.log('Middleware - Redirecting non-admin from admin route');
          const url = request.nextUrl.clone();
          url.pathname = '/admin-login';
          return NextResponse.redirect(url);
        }
      } else {
        console.log('Middleware - Admin check failed, redirecting to admin login');
        const url = request.nextUrl.clone();
        url.pathname = '/admin-login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.log('Middleware - Admin check error, redirecting to admin login:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      return NextResponse.redirect(url);
    }
  }

  // If accessing admin login route and already authenticated as admin, redirect to admin panel
  if (isAdminLoginRoute && session) {
    const adminSession = request.cookies.get('admin-session')?.value;
    if (adminSession) {
      console.log('Middleware - Admin already logged in, redirecting to admin panel');
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    console.log('Middleware - Redirecting authenticated user from auth page');
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 