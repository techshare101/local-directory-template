import {
  Car, Sparkles, Briefcase, GraduationCap, Coffee, Dumbbell,
  Utensils, Heart, Wrench, SprayCan, PawPrint, Building2, MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
  car: Car,
  sparkles: Sparkles,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  coffee: Coffee,
  dumbbell: Dumbbell,
  utensils: Utensils,
  heart: Heart,
  wrench: Wrench,
  'spray-can': SprayCan,
  'paw-print': PawPrint,
  building: Building2,
  'map-pin': MapPin,
}

export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ICONS[id] ?? MapPin
  return <Icon className={className} strokeWidth={1.8} />
}
