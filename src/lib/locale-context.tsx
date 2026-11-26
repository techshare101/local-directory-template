'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, hasLocale, localizePath, type Locale } from '@/lib/locale'

// URL-based locale. English (default) is unprefixed: "/", "/search".
// Spanish lives at "/es/…". The toggle navigates to the localized path so
// server-rendered (bilingual) content actually flips — a client-only store
// would never re-render the SSR data.
const STORAGE_KEY = 'ld-locale'

const listeners = new Set<() => void>()
function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function readStored(): Locale {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'es' ? 'es' : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

interface CtxValue {
  locale: Locale
  setLocale: (l: Locale) => void
  /** Bilingual field selector: given {en, es}, return the current locale's value. */
  l: (v: { en?: string; es?: string } | string | null | undefined) => string
}

const LocaleContext = createContext<CtxValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const first = (pathname || '').split('/')[1]
  const urlLocale: Locale = hasLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE
  const stored = useSyncExternalStore(subscribe, readStored, () => DEFAULT_LOCALE)

  // URL is the source of truth; localStorage only remembers pre-toggle intent.
  const locale = urlLocale

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      listeners.forEach((n) => n())
      // Navigate to the localized URL so SSR content flips.
      if (next !== locale && typeof window !== 'undefined') {
        const path = localizePath(next, pathname || '/')
        window.location.href = path
      }
    },
    [locale, pathname],
  )

  const value = useMemo<CtxValue>(
    () => ({
      locale,
      setLocale,
      l: (v) => {
        if (v == null) return ''
        if (typeof v === 'string') return v
        return v[locale] || v.en || v.es || ''
      },
    }),
    [locale, setLocale, stored],
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): CtxValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
