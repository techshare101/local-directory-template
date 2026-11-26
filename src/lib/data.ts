import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { TABLES } from '@/lib/tables'
import type { Business } from '@/lib/database.types'
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
  return (data ?? []) as unknown as Business[]
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
  return { category: category ?? null, locations: locations ?? [], businesses: businesses ?? [] }
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
  const supabase = await createClient()
  // anon has only an INSERT policy on claims — do not chain .select(), which
  // would need a SELECT policy it does not have.
  const { error } = await supabase.from(TABLES.claims).insert({
    business_id: input.businessId,
    contact_name: input.contactName,
    phone: input.phone,
    whatsapp: input.whatsapp ?? '',
    email: input.email ?? '',
    website: input.website ?? '',
    notes: input.notes ?? '',
    status: 'pending',
  })
  if (error) throw new Error(error.message)
  return { id: input.businessId }
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
  business: { slug: string; name: string; category_id: string | null } | null
}

export async function listClaims(status?: 'pending' | 'approved' | 'rejected') {
  // service-role only: claims carry owner PII and must never be readable via
  // the anon key. Callers must sit behind the ADMIN_TOKEN gate.
  const supabase = createAdminClient()
  let q = supabase
    .from(TABLES.claims)
    .select(`*, ${TABLES.businesses}(slug, name, category_id)`)
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
