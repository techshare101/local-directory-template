import { NextResponse } from 'next/server'
import { TABLES } from '@/lib/tables'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/admin-auth'
import { listClaims, reviewClaim } from '@/lib/data'
import { issueOwnerToken } from '@/lib/owner'
import { sendOwnerLink } from '@/lib/whatsapp'
import { clientIp, logAdminAction } from '@/lib/admin-security'
import { SITE } from '@/lib/site.config'

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

  const supabase = createAdminClient()
  const { data: claim, error: claimErr } = await supabase
    .from(TABLES.claims)
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (claimErr) return NextResponse.json({ error: claimErr.message }, { status: 500 })
  if (!claim) return NextResponse.json({ error: 'claim not found' }, { status: 404 })
  if (claim.status !== 'pending') {
    return NextResponse.json({ error: `claim already ${claim.status}` }, { status: 409 })
  }

  await reviewClaim(id, action)

  await logAdminAction({
    action: `claim_${action}`,
    entityType: 'claim',
    entityId: id,
    detail: { business_id: claim.business_id ?? null },
    ip: clientIp(_req),
  })

  // On approve: resolve the business DIRECTLY by business_id (service role,
  // RLS bypass) and flip to claimed + copy owner-supplied contact info. Gate on
  // business_id, never the embedded relation — it may be absent after review.
  if (action === 'approve' && claim.business_id) {
    const supabase = createAdminClient()
    const patch: Record<string, unknown> = { claimed: true }
    if (claim.phone) patch.phone = claim.phone
    if (claim.whatsapp) patch.whatsapp = claim.whatsapp
    if (claim.email) patch.email = claim.email
    if (claim.website) patch.website = claim.website
    const { error } = await supabase.from(TABLES.businesses).update(patch).eq('id', claim.business_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Mint the owner's dashboard link, then try to deliver it over WhatsApp.
    try {
      const token = await issueOwnerToken(claim.business_id)
      const { data: biz } = await supabase
        .from(TABLES.businesses)
        .select('name')
        .eq('id', claim.business_id)
        .single()
      // Prefer the host the operator is actually using (canonical alias), so a
      // stale NEXT_PUBLIC_SITE_URL can never put localhost in an owner link.
      const host = _req.headers.get('x-forwarded-host') || _req.headers.get('host') || ''
      const proto = _req.headers.get('x-forwarded-proto') || 'https'
      const base = host ? `${proto}://${host}` : SITE.domain.replace(/\/$/, '')
      const ownerUrl = `${base}/owner/${token}`
      const whatsapp = await sendOwnerLink({
        to: claim.whatsapp || claim.phone || '',
        businessName: biz?.name || 'tu negocio',
        url: ownerUrl,
      })
      return NextResponse.json({ ok: true, ownerPath: `/owner/${token}`, ownerUrl, whatsapp })
    } catch (e) {
      return NextResponse.json(
        { ok: true, warning: `Claim approved but owner link failed: ${e instanceof Error ? e.message : 'unknown'}` },
        { status: 200 },
      )
    }
  }

  return NextResponse.json({ ok: true })
}
