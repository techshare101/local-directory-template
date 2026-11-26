// Locale routing rules — shared by server, client and proxy.
// English is the default (unprefixed); Spanish at /es/…
export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const localeNames: Record<Locale, string> = { en: 'English', es: 'Español' }

export function hasLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '')
}

/** Locale-free path → URL for `locale`. Default locale stays unprefixed. */
export function localizePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path
  const rest = path === '/' || path.startsWith('/?') ? path.slice(1) : path
  return `/${locale}${rest}`
}

/** Remove a leading locale segment: "/es/claim" → "/claim". */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/')
  if (!hasLocale(first)) return pathname || '/'
  return `/${rest.join('/')}`
}
