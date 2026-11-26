import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { SITE } from '@/lib/site.config'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <MapPin size={18} strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-slate-900">{SITE.shortName}</span>
            <span className="text-[11px] text-slate-500">{SITE.city}, {SITE.country}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          <Link href="/categories" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">{SITE.navCategories}</Link>
          <Link href="/search" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">{SITE.navSearch}</Link>
          <Link href="/blog" className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900 sm:inline">{SITE.navSpotlight}</Link>
          <Link href="/events" className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900 sm:inline">{SITE.navEvents}</Link>
          <Link
            href="/add-business"
            className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
          >
            {SITE.ctaAddBusiness}
          </Link>
        </nav>
      </div>
    </header>
  )
}
