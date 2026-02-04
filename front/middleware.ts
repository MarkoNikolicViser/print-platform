import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_KEY } from './helpers/constants';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Skip Next internals, static assets, and proxy routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/strapi') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const jwt = req.cookies.get(TOKEN_KEY)?.value;

  const publicRoutes = ['/', '/login', '/register', '/cart'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isStoreRoute = pathname.startsWith('/store');

  if (!jwt) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If logged in:
  if (isStoreRoute) return NextResponse.next();
  return NextResponse.redirect(new URL('/store', req.url));
}

export const config = {
  matcher: ['/:path*'],
};
