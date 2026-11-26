// Pure constants shared by server and client code. Keep this module free of
// Node built-ins and Supabase clients so client components can import it.

export interface HoursRow {
  open: string
  close: string
  closed?: boolean
}

export const DAYS: { key: string; en: string; es: string }[] = [
  { key: 'mon', en: 'Monday', es: 'Lunes' },
  { key: 'tue', en: 'Tuesday', es: 'Martes' },
  { key: 'wed', en: 'Wednesday', es: 'Miércoles' },
  { key: 'thu', en: 'Thursday', es: 'Jueves' },
  { key: 'fri', en: 'Friday', es: 'Viernes' },
  { key: 'sat', en: 'Saturday', es: 'Sábado' },
  { key: 'sun', en: 'Sunday', es: 'Domingo' },
]
