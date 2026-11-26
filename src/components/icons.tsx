import {
  Utensils, ShoppingCart, BedDouble, Landmark, Car, Camera, Dumbbell,
  Sparkles, Heart, Map, Wrench, ShoppingBag, Building2, Church, GraduationCap, MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Icon key per canonical (isla) category, <-> src/data categories.ts icon field.
export const ICONS: Record<string, LucideIcon> = {
  restaurant: Utensils,
  colmado: ShoppingCart,
  lodging: BedDouble,
  bank: Landmark,
  automotive: Car,
  attraction: Camera,
  sports: Dumbbell,
  beauty: Sparkles,
  health: Heart,
  tours: Map,
  services: Wrench,
  shopping: ShoppingBag,
  government: Building2,
  worship: Church,
  education: GraduationCap,
  'map-pin': MapPin,
}

export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ICONS[id] ?? MapPin
  return <Icon className={className} strokeWidth={1.8} />
}
