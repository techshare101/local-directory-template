import { createHash, timingSafeEqual } from 'node:crypto'
import { TABLES } from '@/lib/tables'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Admin security helpers.
 *
 * The admin door is a single shared token (pre-revenue, solo operator). These
 * helpers add the two things a shared secret needs to be defensible:
 * a durable brute-force limit and an audit trail for money-moving actions.
 */

export const LOGIN_WINDOW_MS = 15 * 60 * 1000
export const LOGIN_MAX_FAILURES = 5

/** Real client IP on Vercel; x-forwarded-for is client-appendable, x-real-ip is not. */
export function clientIp(req: Request): string {
  const h = req.headers
  const real = h.get('x-real-ip')
  if (real) return real.trim()
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return 'unknown'
}

/** Constant-time compare on fixed-length digests (length leak + early exit removed). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export async function loginBlocked(ip: string): Promise<{ blocked: boolean; retryAfterSeconds: number }> {
  const supabase = createAdminClient()
  const since = new Date(Date.now() - LOGIN_WINDOW_MS).toISOString()
  const { count } = await supabase
    .from(TABLES.adminAttempts)
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since)

  const failures = count ?? 0
  if (failures < LOGIN_MAX_FAILURES) return { blocked: false, retryAfterSeconds: 0 }
  return { blocked: true, retryAfterSeconds: Math.ceil(LOGIN_WINDOW_MS / 1000) }
}

export async function recordLoginFailure(ip: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from(TABLES.adminAttempts).insert({ ip })
}

export async function clearLoginFailures(ip: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from(TABLES.adminAttempts).delete().eq('ip', ip)
}

export async function logAdminAction(entry: {
  action: string
  entityType?: string
  entityId?: string
  detail?: Record<string, unknown>
  ip?: string
}): Promise<void> {
  // Never let an audit write break the actual operation.
  try {
    const supabase = createAdminClient()
    await supabase.from(TABLES.adminLog).insert({
      action: entry.action,
      entity_type: entry.entityType ?? '',
      entity_id: entry.entityId ?? '',
      detail: entry.detail ?? {},
      ip: entry.ip ?? '',
    })
  } catch {
    /* audit is best-effort */
  }
}
