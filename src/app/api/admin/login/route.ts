import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  clientIp,
  loginBlocked,
  recordLoginFailure,
  clearLoginFailures,
  safeEqual,
  logAdminAction,
  LOGIN_WINDOW_MS,
} from '@/lib/admin-security'

export async function POST(req: Request) {
  const ip = clientIp(req)

  const { blocked } = await loginBlocked(ip)
  if (blocked) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(LOGIN_WINDOW_MS / 1000)) } },
    )
  }

  const body = await req.json().catch(() => null)
  const expected = process.env.ADMIN_TOKEN
  const given = typeof body?.token === 'string' ? body.token : ''

  if (!expected || !given || !safeEqual(given, expected)) {
    // Count only real guesses, not empty submits.
    if (given) await recordLoginFailure(ip)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  await clearLoginFailures(ip)

  const store = await cookies()
  store.set('ld_admin_token', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  await logAdminAction({ action: 'admin_login', ip })

  return NextResponse.json({ ok: true })
}
