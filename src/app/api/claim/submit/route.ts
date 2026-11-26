import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/tables'
import { createClaimSubmission } from '@/lib/data'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { businessSlug, contactName, phone, whatsapp, email, website, notes } = body as Record<string, string>
  if (!businessSlug || !contactName?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'businessSlug, contactName and phone are required' }, { status: 400 })
  }

  // resolve slug -> uuid using the server client (RLS allows selecting listed businesses)
  const supabase = await createClient()
  const { data: biz } = await supabase
    .from(TABLES.businesses)
    .select('id, name')
    .eq('slug', businessSlug)
    .eq('status', 'listed')
    .single()
  if (!biz) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const claim = await createClaimSubmission({
    businessId: biz.id as string,
    contactName: contactName.trim(),
    phone: phone.trim(),
    whatsapp: whatsapp?.trim() || undefined,
    email: email?.trim() || undefined,
    website: website?.trim() || undefined,
    notes: notes?.trim() || undefined,
  })

  return NextResponse.json({ ok: true, claimId: claim.id, listingName: biz.name })
}
