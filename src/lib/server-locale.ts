import { headers } from 'next/headers'
import { DEFAULT_LOCALE, type Locale } from '@/lib/locale'

/** Server-side locale read from the proxy's x-locale header (ES on /es/…). */
export async function getLocale(): Promise<Locale> {
  try {
    const h = await headers()
    return (h.get('x-locale') as Locale) || DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/** Pick the locale-appropriate string from paired fields; falls back to en then the base. */
export function pick(v: { en?: string | null; es?: string | null }, locale: Locale, fallback: string): string {
  const val = locale === 'es' ? v.es : v.en
  return val || v.en || v.es || fallback
}
