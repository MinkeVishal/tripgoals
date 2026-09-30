import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

/**
 * Fast, optimistic gate: send visitors without a session cookie to login before rendering.
 * This is NOT authorisation. Roles are enforced on the server in requireRole() and in every
 * server action.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const login = new URL('/login', request.url);
  login.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/wishlist/:path*'],
};
