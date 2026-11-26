import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const expected = process.env.ADMIN_TOKEN
  if (!expected || body?.token !== expected) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const store = await cookies()
  store.set('ld_admin_token', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return NextResponse.json({ ok: true })
}
