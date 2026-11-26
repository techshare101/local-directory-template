import { NextResponse } from 'next/server'
import { TABLES } from '@/lib/tables'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/admin-auth'
import { listClaims, reviewClaim } from '@/lib/data'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Admin gate — only a logged-in admin (holds ADMIN_TOKEN cookie) may review.
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { action } = await _req.json().catch(() => ({}))
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  const pending = await listClaims('pending')
  const claim = pending.find((c) => c.id === id)
  if (!claim) return NextResponse.json({ error: 'claim not found' }, { status: 404 })

  await reviewClaim(id, action)

  // On approve: resolve the business DIRECTLY by business_id (service role,
  // RLS bypass) and flip to claimed + copy owner-supplied contact info. Gate on
  // business_id, never the embedded relation — it may be absent after review.
  if (action === 'approve' && claim.business_id) {
    const supabase = createAdminClient()
    const patch: Record<string, unknown> = { claimed: true }
    if (claim.phone) patch.phone = claim.phone
    if (claim.email) patch.email = claim.email
    if (claim.website) patch.website = claim.website
    const { error } = await supabase.from(TABLES.businesses).update(patch).eq('id', claim.business_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
