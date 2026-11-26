import { NextResponse } from 'next/server'
import { TABLES } from '@/lib/tables'
import { createAdminClient } from '@/lib/supabase/admin'
import { listClaims, reviewClaim } from '@/lib/data'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { action } = await _req.json().catch(() => ({}))
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  const claims = await listClaims('pending')
  const claim = claims.find((c) => c.id === id)
  if (!claim) return NextResponse.json({ error: 'claim not found' }, { status: 404 })

  await reviewClaim(id, action)

  // On approve: flip the business to claimed (and copy any real contact info the owner supplied).
  // NOTE: business columns are phone/email/website only — whatsapp lives on claims, not businesses.
  if (action === 'approve' && claim.business) {
    const supabase = await createAdminClient()
    const patch: Record<string, unknown> = { claimed: true }
    if (claim.phone) patch.phone = claim.phone
    if (claim.email) patch.email = claim.email
    if (claim.website) patch.website = claim.website
    const { error } = await supabase.from(TABLES.businesses).update(patch).eq('id', claim.business_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
