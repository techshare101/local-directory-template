import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, hasLocale } from '@/lib/locale'

/**
 * URL-based locales. English (default) is unprefixed: "/", "/search".
 * Spanish lives at "/es/…". This proxy:
 *   - "/es/…" → rewrite to the unprefixed route (so app routes stay flat) but
 *     append a header the server can read for ES-first rendering.
 *   - everything else → pass through (EN default).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  if (first === DEFAULT_LOCALE) {
    // "/en/…" → redirect to clean unprefixed URL (single canonical URL per page).
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (hasLocale(first)) {
    // "/es/…": rewrite to the base page, flag ES for the server.
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(first.length + 1) || '/'
    const res = NextResponse.rewrite(url)
    res.headers.set('x-locale', first)
    return res
  }

  return NextResponse.next()
}

export const config = {
  // Skip Next internals, API routes, admin, static assets, files with extensions.
  matcher: ['/((?!_next/|hero/|favicon.ico|api(?:/|$)|admin(?:/|$)|.*\\..+$).*)'],
}
