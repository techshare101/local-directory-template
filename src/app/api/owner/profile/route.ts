import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBusinessByOwnerToken } from '@/lib/owner'
import { DAYS } from '@/lib/hours'
import { TABLES } from '@/lib/tables'

const MAX_GALLERY = 8
const MEDIA_PREFIX = '/storage/v1/object/public/isabela-media/'

function str(v: unknown, max = 500): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function mediaUrl(v: unknown): string | null {
  if (typeof v !== 'string') return null
  // Only accept images served from our own public bucket.
  try {
    const u = new URL(v)
    return u.pathname.includes(MEDIA_PREFIX) ? u.toString() : null
  } catch {
    return null
  }
}

function num(v: unknown, min: number, max: number): number | null {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  if (!Number.isFinite(n) || n < min || n > max) return null
  return n
}

// Owner profile update. Auth = owner token from /owner/<token>.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const business = await getBusinessByOwnerToken(String(body.token || ''))
  if (!business) return NextResponse.json({ error: 'Invalid or expired owner link' }, { status: 401 })

  const name = str(body.name, 120)
  if (!name) return NextResponse.json({ error: 'Business name is required' }, { status: 400 })

  const hoursIn = body.hours && typeof body.hours === 'object' ? body.hours : {}
  const hours: Record<string, { open: string; close: string; closed?: boolean }> = {}
  for (const d of DAYS) {
    const row = (hoursIn as Record<string, unknown>)[d.key] as Record<string, unknown> | undefined
    if (!row) continue
    const closed = Boolean(row.closed)
    const open = str(row.open, 5) || '09:00'
    const close = str(row.close, 5) || '18:00'
    hours[d.key] = closed ? { open, close, closed: true } : { open, close }
  }

  const gallery = Array.isArray(body.image_gallery)
    ? (body.image_gallery.map(mediaUrl).filter(Boolean) as string[]).slice(0, MAX_GALLERY)
    : []
  const hero = mediaUrl(body.image_hero) || business.image_hero || ''

  const lat = num(body.latitude, -90, 90)
  const lng = num(body.longitude, -180, 180)

  const patch: Record<string, unknown> = {
    name,
    description_es: str(body.description_es, 2000),
    description_en: str(body.description_en, 2000),
    phone: str(body.phone, 40),
    whatsapp: str(body.whatsapp, 40),
    email: str(body.email, 160),
    website: str(body.website, 200).replace(/^https?:\/\//, ''),
    address_es: str(body.address_es, 300),
    address_en: str(body.address_en, 300),
    hours,
    image_hero: hero,
    image_gallery: gallery,
    updated_at: new Date().toISOString(),
  }
  if (
    typeof body.latitude === 'string' &&
    String(body.latitude).trim() !== '' &&
    lat === null
  ) {
    return NextResponse.json({ error: 'Latitude must be between -90 and 90' }, { status: 400 })
  }
  if (
    typeof body.longitude === 'string' &&
    String(body.longitude).trim() !== '' &&
    lng === null
  ) {
    return NextResponse.json({ error: 'Longitude must be between -180 and 180' }, { status: 400 })
  }
  if (lat !== null && lng !== null) {
    patch.latitude = lat
    patch.longitude = lng
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from(TABLES.businesses).update(patch).eq('id', business.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
