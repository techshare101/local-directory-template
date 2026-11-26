// Central constants for the directory instance.
// White-label: change these per deployment.
export const DIRECTORY = {
  name: 'Villa Isabela Directory',
  city: 'Villa Isabela',
  country: 'Dominican Republic',
  tagline: 'Find the best local services in your area',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  // number formatting / loyalty marker used across pages
  region: 'Puerto Plata Province, Dominican Republic',
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
