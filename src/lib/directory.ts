import { SITE } from '@/lib/site.config'

// Re-export the instance identity so existing imports keep working.
// White-label: change once in src/lib/site.config.ts, not here.
export const DIRECTORY = {
  name: SITE.name,
  city: SITE.city,
  country: SITE.country,
  tagline: SITE.tagline,
  domain: SITE.domain,
  region: SITE.region,
}

// Ordered category slugs (mirrors the reference directory home grid).
export const CATEGORY_ORDER = [
  'automotive',
  'beauty-personal-care',
  'community-government',
  'education-childcare',
  'events-entertainment',
  'fitness-recreation',
  'food-drink',
  'health-medical',
  'home-trade-services',
  'other-services',
  'pets-animals',
  'professional-services',
]

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
