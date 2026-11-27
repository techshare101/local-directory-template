// Pure helpers — safe to import from client components (no server deps).

export type FeaturedFields = {
  featured: boolean
  featured_until?: string | null
}

/** A listing is featured only while its paid window is open. */
export function isFeatured(b: FeaturedFields, now = Date.now()): boolean {
  if (!b.featured) return false
  if (!b.featured_until) return true
  return new Date(b.featured_until).getTime() > now
}

export function daysLeft(until: string | null | undefined, now = Date.now()): number {
  if (!until) return 0
  return Math.max(0, Math.ceil((new Date(until).getTime() - now) / 86_400_000))
}

export const FEATURED_PLANS = {
  monthly: { id: 'monthly', label: '1 month', price: 29, days: 30 },
  quarterly: { id: 'quarterly', label: '3 months', price: 75, days: 90 },
} as const

export type FeaturedPlanId = keyof typeof FEATURED_PLANS
