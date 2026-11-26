'use client'

import { useLocale } from '@/lib/locale-context'
import { localeNames } from '@/lib/locale'

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()
  const other = locale === 'en' ? 'es' : 'en'
  return (
    <button
      onClick={() => setLocale(other)}
      aria-label={`Switch language · Cambiar idioma`}
      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  )
}
