// ============================================================================
// WHITE-LABEL SITE CONFIG — the ONE file to edit to spin up a new instance.
//
// To launch a new city or vertical (e.g. "MedSpa Directory, Miami" or
// "Restaurants, Santo Domingo"):
//   1. Duplicate this file's values below.
//   2. Set `tablePrefix` to a unique value (e.g. `medspa_`) so the app reads
//      from a fresh set of tables that won't collide with any other deploy.
//   3. Apply the matching SQL migrations (core schema + seed) with that prefix.
//   4. Set env vars:
//        NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
//        NEXT_PUBLIC_SITE_URL
//      and optionally NEXT_PUBLIC_DIRECTORY_TABLE_PREFIX to override `tablePrefix`.
//   5. Deploy. Done — no other file needs touching for rebranding.
// ============================================================================

const envPrefix = process.env.NEXT_PUBLIC_DIRECTORY_TABLE_PREFIX

export const SITE = {
  // ---- identity -----------------------------------------------------------
  shortName: 'Isabela Directory', // header brand
  name: 'Villa Isabela Directory', // full / legal-ish name
  city: 'Villa Isabela',
  country: 'Dominican Republic',
  region: 'Puerto Plata Province, Dominican Republic', // footer / SEO area
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // ---- schema / data ------------------------------------------------------
  // Every table this app reads/writes is `<tablePrefix><table>`. Set it per
  // instance so multiple verticals can share one Supabase project, or one
  // vertical can own the whole project, without collisions.
  tablePrefix: envPrefix || `isabela_`,

  // ---- copy ---------------------------------------------------------------
  tagline: 'Find the best local services in your area',
  heroHeadline: 'Discover local businesses in Villa Isabela',
  heroSubtitle:
    'Find the best local services, restaurants and experiences on the Dominican north coast.',
  heroImage:
    'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80',
  searchPlaceholder: 'Search for a business…',
  statSuburbsLabel: 'Suburbs covered',
  statSuburbsValue: '4',
  statVerifiedLabel: 'Verified owners',
  statVerifiedValue: '0+',
  browseByCategoryTitle: 'Browse by category',
  browseByCategorySubtitle: 'Find the services you need.',
  browseAllLabel: 'Browse all categories',
  freshTitle: 'Fresh in Villa Isabela',
  freshSubtitle: 'The newest businesses to join the directory.',
  freshAllLabel: 'View all',
  spotlightTitle: 'Local Spotlight',
  spotlightSubtitle: 'News, tips and stories from Villa Isabela.',
  spotlightAllLabel: 'View all posts',
  ctaAddBusiness: 'Add your business',
  navCategories: 'Categories',
  navSearch: 'Search',
  navMap: 'Map',
  navSpotlight: 'Spotlight',
  navEvents: 'Events',
  footerTagline: 'Supporting local business on the Dominican north coast.',
  pricingHeadline: 'Get discovered in Villa Isabela',
  addBusinessSubtitle: 'Get discovered in Villa Isabela. Free listing, no credit card required.',
  categoriesSubtitle: 'Browse the Villa Isabela directory by category.',
  newListingsSubtitle: 'The newest listings in Villa Isabela.',
} as const

// SEO metadata (used by src/app/layout.tsx)
export const SEO = {
  titleTemplate: `%s | ${SITE.name}`,
  titleDefault: `${SITE.name} — Find local businesses`,
  description: `Find the best local services in ${SITE.city}, ${SITE.country}. Browse categories, compare services and support local businesses.`,
  keywords: `${SITE.city} business directory, local services ${SITE.city}, ${SITE.country} local businesses`,
}
