import { createClient } from '@/lib/supabase/server'

export async function getLocations() {
  const supabase = await createClient()
  const { data } = await supabase.from('isabela_locations').select('*').order('name', { ascending: true })
  return data ?? []
}
