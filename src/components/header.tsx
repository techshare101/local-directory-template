import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { SITE } from '@/lib/site.config'
import { LanguageToggle } from '@/components/language-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <MapPin size={22} strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-slate-900">{SITE.shortName}</span>
            <span className="text-xs text-slate-500">{SITE.city}, {SITE.country}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-base font-medium text-slate-600 sm:gap-2">
          <Link href="/categories" className="rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">{SITE.navCategories}</Link>
          <Link href="/search" className="rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">{SITE.navSearch}</Link>
          <Link href="/map" className="rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">{SITE.navMap}</Link>
          <Link href="/blog" className="hidden rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 sm:inline">{SITE.navSpotlight}</Link>
          <Link href="/events" className="hidden rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 sm:inline">{SITE.navEvents}</Link>
          <Link
            href="/add-business"
            className="ml-1 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {SITE.ctaAddBusiness}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  )
}
