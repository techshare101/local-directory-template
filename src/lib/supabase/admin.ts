import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client for SERVER-ONLY admin operations (claim review). The
// service_role key bypasses RLS and must never be exposed to the client —
// it is used exclusively in API route handlers / server components behind
// the ADMIN_TOKEN gate. Owner PII (claims) is readable only through here.
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  )
}
