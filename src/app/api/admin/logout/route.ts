import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clientIp, logAdminAction } from '@/lib/admin-security'

export async function POST(req: Request) {
  const store = await cookies()
  store.delete('ld_admin_token')
  await logAdminAction({ action: 'admin_logout', ip: clientIp(req) })
  return NextResponse.json({ ok: true })
}
