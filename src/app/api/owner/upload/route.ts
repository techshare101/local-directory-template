import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBusinessByOwnerToken } from '@/lib/owner'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export const runtime = 'nodejs'

// Owner photo upload. Auth = the owner access token minted at claim approval.
// Files land in the public `isabela-media` bucket under /<slug>/ and the public
// URL is returned; the client decides hero vs gallery and persists on save.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Expected multipart form data' }, { status: 400 })

  const token = String(form.get('token') || '')
  const file = form.get('file')

  const business = await getBusinessByOwnerToken(token)
  if (!business) return NextResponse.json({ error: 'Invalid or expired owner link' }, { status: 401 })

  if (!(file instanceof File)) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are allowed' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 413 })
  }

  const ext = EXT[file.type]
  const rand = Math.random().toString(36).slice(2, 10)
  const path = `${business.slug}/${Date.now()}-${rand}.${ext}`

  const supabase = createAdminClient()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error } = await supabase.storage.from('isabela-media').upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: pub } = supabase.storage.from('isabela-media').getPublicUrl(path)
  return NextResponse.json({ ok: true, url: pub.publicUrl, path })
}
