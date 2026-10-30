/**
 * Single Responsibility: Next.js Edge Middleware enforcing Content Security Policy (CSP),
 * per-request nonce generation, and hardened HTTP security headers.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate cryptographically secure nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Strict CSP configuration tailored for Next.js App Router and AI Studio iFrame environment
  const isDev = process.env.NODE_ENV !== 'production';

  const cspDirectives = [
    "default-src 'self'",
    // In dev mode allow unsafe-eval for hot compilation; in prod use strict-dynamic + nonce
    isDev
      ? `script-src 'self' 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://picsum.photos https://images.unsplash.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Support embedding in AI Studio preview iframe
    "frame-ancestors 'self' *",
  ];

  const cspHeader = cspDirectives.join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
