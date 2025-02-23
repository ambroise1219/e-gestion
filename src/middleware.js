import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // List of public paths that don't require authentication
  const publicPaths = [
    '/auth',
    '/auth/login',
    '/auth/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/'
  ];

  // List of protected paths that require authentication
  const protectedPaths = [
    '/tableau-de-bord',
    '/employes',
    '/projets',
    '/stock',
    '/finances',
    '/planning',
    '/fournisseurs',
    '/securite',
    '/documents',
    '/parametres'
  ];

  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // If token exists, verify it
  let isValidToken = false;
  if (token) {
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
      );
      isValidToken = true;
    } catch (error) {
      isValidToken = false;
    }
  }

  // If user is authenticated and tries to access auth page, redirect to dashboard
  if (isValidToken && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/tableau-de-bord', request.url));
  }

  // If user is not authenticated and tries to access protected path, redirect to auth
  if (!isValidToken && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For all other routes, proceed if token is valid, otherwise redirect to auth
  if (!isValidToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};