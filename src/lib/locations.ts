import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/tables'

export async function getLocations() {
  const supabase = await createClient()
  const { data } = await supabase.from(TABLES.locations).select('*').order('name', { ascending: true })
  return data ?? []
}
