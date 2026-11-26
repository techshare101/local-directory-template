import { createClient } from '@/lib/supabase/server'
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
