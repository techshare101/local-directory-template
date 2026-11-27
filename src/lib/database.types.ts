// Lightweight row types mirroring the supabase/migrations schema.
// These let the UI compile before a Supabase project is linked/types generated.

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  sort_order: number
  name_es?: string
  name_en?: string
  desc_es?: string
  desc_en?: string
  schema_type?: string
  gradient_from?: string
  gradient_via?: string
  gradient_to?: string
}

export interface Location {
  id: string
  name: string
  region: string
  slug?: string
  kind?: string
  launched?: boolean
  sort_order?: number
  latitude?: number | null
  longitude?: number | null
}

export interface Business {
  id: string
  slug: string
  name: string
  category_id: string | null
  location_id: string | null
  description: string
  services: string[]
  address: string
  phone: string
  email: string
  website: string
  price_min: string
  hours: unknown
  image_hero: string
  image_logo: string
  claimed: boolean
  featured: boolean
  featured_until?: string | null
  featured_rank?: number
  featured_note?: string
  status: string
  created_at: string
  description_es?: string
  description_en?: string
  address_es?: string
  address_en?: string
  latitude?: number | null
  longitude?: number | null
  rating?: number | null
  reviews_count?: number | null
  source?: string
  schema_type?: string
  whatsapp?: string
  image_gallery?: string[]
  owner_token?: string | null
  owner_token_expires?: string | null
  updated_at?: string
}

export interface Offer {
  id: string
  business_id: string | null
  title: string
  description: string
  price: string
  code: string
  valid_until: string
  terms: string
  image: string
  created_at: string
}

export interface Post {
  id: string
  business_id: string | null
  title: string
  excerpt: string
  cover: string
  body: string
  published_at: string
}

export interface Event {
  id: string
  business_id: string | null
  title: string
  starts_at: string
  venue: string
  description: string
  cover: string
}

export interface Enquiry {
  id: string
  business_id: string | null
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  status: string
  created_at: string
}

export interface Submission {
  id: string
  business_name: string
  category_id: string | null
  location_id: string | null
  description: string
  website: string
  email: string
  status: string
  created_at: string
}
