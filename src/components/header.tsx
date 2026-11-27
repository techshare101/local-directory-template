import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { SITE } from '@/lib/site.config'
import { LanguageToggle } from '@/components/language-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 w-full min-w-0 items-center justify-between gap-2 px-3 sm:h-20 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm sm:h-11 sm:w-11">
            <MapPin size={20} strokeWidth={2} />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-bold text-slate-900 sm:text-lg">{SITE.shortName}</span>
            <span className="hidden truncate text-xs text-slate-500 sm:block">{SITE.city}, {SITE.country}</span>
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto text-sm font-medium text-slate-600 [scrollbar-width:none] sm:gap-2 sm:text-base [&::-webkit-scrollbar]:hidden">
          <Link href="/categories" className="hidden shrink-0 rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 md:inline">{SITE.navCategories}</Link>
          <Link href="/search" className="shrink-0 rounded-lg px-2 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 sm:px-3">{SITE.navSearch}</Link>
          <Link href="/map" className="hidden shrink-0 rounded-lg px-2 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 sm:inline sm:px-3">{SITE.navMap}</Link>
          <Link href="/blog" className="hidden shrink-0 rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 lg:inline">{SITE.navSpotlight}</Link>
          <Link href="/events" className="hidden shrink-0 rounded-lg px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 lg:inline">{SITE.navEvents}</Link>
          <Link
            href="/add-business"
            className="ml-1 shrink-0 whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4 sm:py-2.5"
          >
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">{SITE.ctaAddBusiness}</span>
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  )
}
