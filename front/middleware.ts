import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from './helpers/constants';

interface JWTPayload {
  id: number;
  role?: string;
  exp: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals i static fajlove
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/strapi') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_KEY)?.value;

  // 🔴 Ako nema tokena
  if (!token) {
    // Guest ne može na /store
    if (pathname.startsWith('/store')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  }

  let decoded: JWTPayload;

  try {
    decoded = jwtDecode<JWTPayload>(token);
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = decoded.role;

  // 🔒 STORE je dozvoljen samo shop roli
  if (pathname.startsWith('/store')) {
    if (role !== 'shop') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 🔥 SHOP može samo na /store
  if (role === 'shop') {
    if (!pathname.startsWith('/store')) {
      return NextResponse.redirect(new URL('/store', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
