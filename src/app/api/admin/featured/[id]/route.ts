import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { approveFeaturedRequest, rejectFeaturedRequest } from '@/lib/data'
import { clientIp, logAdminAction } from '@/lib/admin-security'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const action = body?.action
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
  }

  try {
    if (action === 'reject') {
      const res = await rejectFeaturedRequest(id)
      await logAdminAction({
        action: 'featured_reject',
        entityType: 'featured_request',
        entityId: id,
        ip: clientIp(req),
      })
      return NextResponse.json(res)
    }
    const days = typeof body?.days === 'number' && body.days > 0 && body.days <= 365 ? body.days : undefined
    const result = await approveFeaturedRequest(id, days)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 })
    await logAdminAction({
      action: 'featured_approve',
      entityType: 'featured_request',
      entityId: id,
      detail: { slug: result.slug, until: result.until, days: result.days },
      ip: clientIp(req),
    })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
