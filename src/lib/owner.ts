import { randomBytes } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { TABLES } from '@/lib/tables'
import type { Business } from '@/lib/database.types'

// Owner access tokens: a long random secret minted at claim approval and stored
// on the business row. The owner receives /owner/<token> by WhatsApp or email.
// No password, no email deliverability dependency. Expires after 90 days.

export const OWNER_TOKEN_DAYS = 90

export function mintOwnerToken(): string {
  return 'own_' + randomBytes(24).toString('base64url')
}

export function tokenExpiry(days = OWNER_TOKEN_DAYS): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

/** Server-only. Returns the business for a valid, unexpired owner token. */
export async function getBusinessByOwnerToken(token: string): Promise<Business | null> {
  if (!token || !token.startsWith('own_') || token.length < 20) return null
  const supabase = createAdminClient()
  const { data } = await supabase
    .from(TABLES.businesses)
    .select('*')
    .eq('owner_token', token)
    .maybeSingle()
  if (!data) return null
  const row = data as unknown as Business
  if (row.owner_token_expires && new Date(row.owner_token_expires).getTime() < Date.now()) return null
  return row
}

/** Server-only. Mints + stores an owner token on a claimed business. */
export async function issueOwnerToken(businessId: string): Promise<string> {
  const supabase = createAdminClient()
  const token = mintOwnerToken()
  const { error } = await supabase
    .from(TABLES.businesses)
    .update({ owner_token: token, owner_token_expires: tokenExpiry() })
    .eq('id', businessId)
  if (error) throw new Error(error.message)
  return token
}

export interface HoursRow {
  open: string
  close: string
  closed?: boolean
}

export { DAYS } from '@/lib/hours'
