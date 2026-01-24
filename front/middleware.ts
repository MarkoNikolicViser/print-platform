import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_KEY } from './helpers/constants'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const jwt = req.cookies.get(TOKEN_KEY)?.value;

    const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/cart'];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isStoreRoute = pathname.startsWith('/store');

    if (!jwt) {
        if (isPublicRoute) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (jwt) {
        if (isStoreRoute) return NextResponse.next();
        return NextResponse.redirect(new URL('/store', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'],
};
