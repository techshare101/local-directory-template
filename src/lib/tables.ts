import { SITE } from '@/lib/site.config'

// Table-name resolver. Every table referenced in data access and forms flows
// through here so the configured `tablePrefix` (from SITE config / env) is the
// single source of truth for which tables an instance reads and writes.
//
//   tb('categories')  ->  'isabela_categories'   (default instance)
//   tb('businesses')  ->  'medspa_businesses'   (a med-spa vertical)
export const tb = (table: string): string => `${SITE.tablePrefix}${table}`

export const TABLES = {
  categories: tb('categories'),
  locations: tb('locations'),
  businesses: tb('businesses'),
  offers: tb('offers'),
  posts: tb('posts'),
  events: tb('events'),
  enquiries: tb('enquiries'),
  submissions: tb('submissions'),
  claims: tb('claims'),
  featuredRequests: tb('featured_requests'),
} as const
