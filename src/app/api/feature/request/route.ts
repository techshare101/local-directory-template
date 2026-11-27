import { NextResponse } from 'next/server'
import { createFeaturedRequest } from '@/lib/data'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: Record<string, unknown> | null = null
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const businessName = String(body?.businessName ?? '').trim()
  const whatsapp = String(body?.whatsapp ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const contactName = String(body?.contactName ?? '').trim()
  const message = String(body?.message ?? '').trim().slice(0, 800)
  const slug = String(body?.businessSlug ?? '').trim()
  const plan = body?.plan === 'quarterly' ? 'quarterly' : 'monthly'

  const digits = whatsapp.replace(/\D/g, '')
  if (businessName.length < 2) {
    return NextResponse.json({ error: 'Tell us the business name.' }, { status: 400 })
  }
  if (digits.length < 7) {
    return NextResponse.json({ error: 'A reachable WhatsApp number is required.' }, { status: 400 })
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'That email looks invalid.' }, { status: 400 })
  }

  try {
    const { id } = await createFeaturedRequest({
      businessName,
      businessSlug: slug,
      contactName,
      whatsapp,
      email,
      plan,
      message,
    })
    return NextResponse.json({ ok: true, id })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Could not save the request' },
      { status: 500 },
    )
  }
}
