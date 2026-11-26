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

// Ordered category slugs (canonical vertical taxonomy from the reconciled
// isla data model — the home grid order).
export const CATEGORY_ORDER = [
  'restaurant',
  'colmado',
  'lodging',
  'bank',
  'automotive',
  'attraction',
  'sports-recreation',
  'beauty-wellness',
  'health-pharmacy',
  'tours',
  'local-services',
  'shopping',
  'government',
  'worship',
  'education',
]

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
