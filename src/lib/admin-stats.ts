import { createAdminClient } from '@/lib/supabase/admin'
import { TABLES } from '@/lib/tables'

export interface AdminStats {
  businesses: number
  claimed: number
  pendingClaims: number
  enquiries: number
  submissions: number
  withPhotos: number
}

// Operator-console aggregates. Service role, server-only.
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient()
  const head = { count: 'exact' as const, head: true }

  const [businesses, claimed, pendingClaims, enquiries, submissions, withPhotos] = await Promise.all([
    supabase.from(TABLES.businesses).select('*', head),
    supabase.from(TABLES.businesses).select('*', head).eq('claimed', true),
    supabase.from(TABLES.claims).select('*', head).eq('status', 'pending'),
    supabase.from(TABLES.enquiries).select('*', head),
    supabase.from(TABLES.submissions).select('*', head),
    supabase.from(TABLES.businesses).select('*', head).not('image_hero', 'is', null).neq('image_hero', ''),
  ])

  return {
    businesses: businesses.count ?? 0,
    claimed: claimed.count ?? 0,
    pendingClaims: pendingClaims.count ?? 0,
    enquiries: enquiries.count ?? 0,
    submissions: submissions.count ?? 0,
    withPhotos: withPhotos.count ?? 0,
  }
}
