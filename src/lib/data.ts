import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { TABLES } from '@/lib/tables'
import type { Business } from '@/lib/database.types'
import { isFeatured } from '@/lib/featured'

/** Paid spots first while their window is open; expired windows fall back to name order. */
function featuredFirst<T extends { featured: boolean; featured_until?: string | null; name: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) => Number(isFeatured(b)) - Number(isFeatured(a)) || a.name.localeCompare(b.name),
  )
}
export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from(TABLES.categories)
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function getBusinesses() {
  const supabase = await createClient()
  const { data } = await supabase
    .from(TABLES.businesses)
    .select('*')
    .eq('status', 'listed')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getHome() {
  const supabase = await createClient()
  const [{ data: categories }, { data: businesses }, { data: posts }, { data: events }] =
    await Promise.all([
      supabase.from(TABLES.categories).select('*').order('sort_order', { ascending: true }),
      supabase.from(TABLES.businesses).select('*').eq('status', 'listed').order('created_at', { ascending: false }),
      supabase.from(TABLES.posts).select('*').order('published_at', { ascending: false }),
      supabase.from(TABLES.events).select('*').order('starts_at', { ascending: true }),
    ])
  return { categories: categories ?? [], businesses: businesses ?? [], posts: posts ?? [], events: events ?? [] }
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient()
  const { data: business } = await supabase
    .from(TABLES.businesses)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'listed')
    .single()
  if (!business) return null
  const [{ data: category }, { data: location }, { data: offers }, { data: posts }, { data: events }] =
    await Promise.all([
      supabase.from(TABLES.categories).select('*').eq('id', business.category_id).single(),
      supabase.from(TABLES.locations).select('*').eq('id', business.location_id).single(),
      supabase.from(TABLES.offers).select('*').eq('business_id', business.id).order('created_at', { ascending: true }),
      supabase.from(TABLES.posts).select('*').eq('business_id', business.id).order('published_at', { ascending: false }),
      supabase.from(TABLES.events).select('*').eq('business_id', business.id).order('starts_at', { ascending: true }),
    ])
  return {
    business,
    category: category ?? null,
    location: location ?? null,
    offers: offers ?? [],
    posts: posts ?? [],
    events: events ?? [],
  }
}

export async function searchBusinesses(query: string, category: string) {
  const supabase = await createClient()
  let q = supabase
    .from(TABLES.businesses)
    .select(`*, ${TABLES.categories}(id,name), ${TABLES.locations}(id,name)`)
    .eq('status', 'listed')
    .order('featured', { ascending: false })
    .order('name', { ascending: true })
  if (query.trim()) q = q.ilike('name', `%${query.trim()}%`)
  if (category) q = q.eq('category_id', category)
  const { data } = await q
  return featuredFirst((data ?? []) as unknown as Business[])
}

export async function getCategoryAndLocations(categoryId: string) {
  const supabase = await createClient()
  const [{ data: category }, { data: locations }, { data: businesses }] = await Promise.all([
    supabase.from(TABLES.categories).select('*').eq('id', categoryId).single(),
    supabase.from(TABLES.locations).select('*').order('name', { ascending: true }),
    supabase
      .from(TABLES.businesses)
      .select('*')
      .eq('status', 'listed')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false }),
  ])
  return { category: category ?? null, locations: locations ?? [], businesses: featuredFirst(businesses ?? []) }
}

/** Businesses that carry real coordinates — the map dataset (~90% coverage). */
export async function getMapBusinesses() {
  const supabase = await createClient()
  const { data } = await supabase
    .from(TABLES.businesses)
    .select(`*, ${TABLES.categories}(id, name, schema_type)`)
    .eq('status', 'listed')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('name', { ascending: true })
  return (data ?? []) as unknown as (Business & {
    categories: { id: string; name: string; schema_type: string } | null
  })[]
}

/** A lightweight, listing-card-safe projection for map sidebar + markers. */
export function toMapPoint(
  b: Business & { categories?: { id: string; name: string } | null },
  locale: 'en' | 'es',
) {
  return {
    id: b.id,
    slug: b.slug,
    lat: Number(b.latitude),
    lng: Number(b.longitude),
    name: b.name,
    category: b.categories?.name ?? '',
    categoryId: b.categories?.id ?? b.category_id ?? '',
    address: locale === 'es' ? b.address_es || b.address : b.address_en || b.address,
    claimed: b.claimed,
  }
}

// ============================================================================
// CLAIMING (manual review, ported from isla Phase 2 — Option A)
// ============================================================================

export async function getClaimableListings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from(TABLES.businesses)
    .select('slug, name')
    .eq('status', 'listed')
    .order('name', { ascending: true })
  return (data ?? []) as { slug: string; name: string }[]
}

export async function createClaimSubmission(input: {
  businessId: string
  contactName: string
  phone: string
  whatsapp?: string
  email?: string
  website?: string
  notes?: string
}) {
  // Service-role insert so we can read back the generated claim id in the same
  // request. Anon has INSERT-only RLS on claims, so an anon insert cannot
  // return the row — and the API must answer with the real claim id.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from(TABLES.claims)
    .insert({
      business_id: input.businessId,
      contact_name: input.contactName,
      phone: input.phone,
      whatsapp: input.whatsapp ?? '',
      email: input.email ?? '',
      website: input.website ?? '',
      notes: input.notes ?? '',
      status: 'pending',
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id as string }
}

export type ClaimRow = {
  id: string
  business_id: string
  contact_name: string
  phone: string
  whatsapp: string
  email: string
  website: string
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  reviewed_at: string | null
  business: { slug: string; name: string; category_id: string | null; owner_token?: string | null } | null
}

export async function listClaims(status?: 'pending' | 'approved' | 'rejected') {
  // service-role only: claims carry owner PII and must never be readable via
  // the anon key. Callers must sit behind the ADMIN_TOKEN gate.
  const supabase = createAdminClient()
  let q = supabase
    .from(TABLES.claims)
    .select(`*, ${TABLES.businesses}(slug, name, category_id, owner_token)`)
    .order('submitted_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data } = await q
  return (data ?? []) as unknown as ClaimRow[]
}

export async function reviewClaim(claimId: string, action: 'approve' | 'reject') {
  // service-role (RLS bypass) so admin review is not subject to anon policies.
  const supabase = createAdminClient()
  const { error } = await supabase
    .from(TABLES.claims)
    .update({ status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', claimId)
  if (error) throw new Error(error.message)
}

// ============================================================================
// FEATURED PLACEMENTS (paid, time-boxed, operator-approved)
// ============================================================================

/** Listings whose paid window is still open. */
export async function getFeatured(limit = 6) {
  const supabase = await createClient()
  const nowIso = new Date().toISOString()
  const { data } = await supabase
    .from(TABLES.businesses)
    .select('*')
    .eq('status', 'listed')
    .eq('featured', true)
    .or(`featured_until.is.null,featured_until.gt.${nowIso}`)
    .order('featured_rank', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as Business[]
}

export type FeaturedRequestRow = {
  id: string
  business_slug: string
  business_name: string
  contact_name: string
  whatsapp: string
  email: string
  plan: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export async function createFeaturedRequest(input: {
  businessName: string
  businessSlug?: string
  contactName?: string
  whatsapp?: string
  email?: string
  plan?: string
  message?: string
}) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from(TABLES.featuredRequests)
    .insert({
      business_name: input.businessName,
      business_slug: input.businessSlug ?? '',
      contact_name: input.contactName ?? '',
      whatsapp: input.whatsapp ?? '',
      email: input.email ?? '',
      plan: input.plan ?? 'monthly',
      message: input.message ?? '',
      status: 'pending',
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id as string }
}

export async function listFeaturedRequests(status?: 'pending' | 'approved' | 'rejected') {
  // service-role only: buyer contact details must sit behind the ADMIN_TOKEN gate.
  const supabase = createAdminClient()
  let q = supabase
    .from(TABLES.featuredRequests)
    .select('*')
    .order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data } = await q
  return (data ?? []) as FeaturedRequestRow[]
}

/**
 * Approve a paid request: opens the listing's featured window and pins it.
 * Activation is manual on purpose — payment is collected out-of-band first.
 */
export async function approveFeaturedRequest(requestId: string, days?: number) {
  const supabase = createAdminClient()
  const { data: req, error: reqErr } = await supabase
    .from(TABLES.featuredRequests)
    .select('*')
    .eq('id', requestId)
    .maybeSingle()
  if (reqErr) throw new Error(reqErr.message)
  if (!req) return { ok: false as const, error: 'Request not found' }
  if (req.status !== 'pending') return { ok: false as const, error: `Request already ${req.status}` }

  const span = days ?? (req.plan === 'quarterly' ? 90 : 30)
  const until = new Date(Date.now() + span * 86_400_000).toISOString()

  // Match by slug when provided, otherwise by exact name (single listed row).
  let lookup = supabase.from(TABLES.businesses).select('id, slug').eq('status', 'listed')
  lookup = req.business_slug ? lookup.eq('slug', req.business_slug) : lookup.eq('name', req.business_name)
  const { data: biz } = await lookup.limit(1).maybeSingle()

  if (!biz) return { ok: false as const, error: 'No listed business matches this request' }

  const { error: bizErr } = await supabase
    .from(TABLES.businesses)
    .update({ featured: true, featured_until: until, featured_rank: 1, featured_note: `Paid placement (${req.plan})` })
    .eq('id', biz.id)
  if (bizErr) throw new Error(bizErr.message)

  const { error: stErr } = await supabase
    .from(TABLES.featuredRequests)
    .update({ status: 'approved' })
    .eq('id', requestId)
  if (stErr) throw new Error(stErr.message)

  return { ok: true as const, slug: biz.slug, until, days }
}

export async function rejectFeaturedRequest(requestId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from(TABLES.featuredRequests)
    .update({ status: 'rejected' })
    .eq('id', requestId)
  if (error) throw new Error(error.message)
  return { ok: true as const }
}
