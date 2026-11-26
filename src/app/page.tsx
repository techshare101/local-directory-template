import Link from 'next/link'
import { Search } from 'lucide-react'
import { getHome } from '@/lib/data'
import { CATEGORY_ORDER } from '@/lib/directory'
import { SITE } from '@/lib/site.config'
import { CategoryIcon } from '@/components/icons'
import { getLocale, pick } from '@/lib/server-locale'
import type { Business } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const locale = await getLocale()
  const { categories, businesses } = await getHome()

  const counts: Record<string, number> = {}
  for (const b of businesses) {
    if (b.category_id) counts[b.category_id] = (counts[b.category_id] || 0) + 1
  }
  const orderedCategories = [...categories].sort(
    (a, b) => (CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id)) || (a.sort_order - b.sort_order)
  )
  const fresh = businesses.slice(0, 8)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden bg-emerald-950 sm:-mx-6 lg:-mx-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${SITE.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative px-6 py-16 text-white sm:px-10 sm:py-24">
          <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
            {SITE.heroHeadline}
          </h1>
          <p className="mt-3 max-w-lg text-emerald-100">
            {SITE.heroSubtitle}
          </p>
          <form action="/search" className="mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                placeholder={SITE.searchPlaceholder}
                className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400">
              Search
            </button>
          </form>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value={`${businesses.length}+`} label="Local businesses" />
            <Stat value={SITE.statSuburbsValue} label={SITE.statSuburbsLabel} />
            <Stat value={`${categories.length}`} label="Categories" />
            <Stat value={SITE.statVerifiedValue} label={SITE.statVerifiedLabel} />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{SITE.browseByCategoryTitle}</h2>
            <p className="text-sm text-slate-500">{SITE.browseByCategorySubtitle}</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-emerald-700 hover:underline">
            {SITE.browseAllLabel}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {orderedCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                <CategoryIcon id={c.icon || 'map-pin'} className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">{pick({ en: c.name_en, es: c.name_es }, locale, c.name)}</span>
                <span className="text-xs text-slate-500">{counts[c.id] || 0} listings</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh listings */}
      {fresh.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{SITE.freshTitle}</h2>
              <p className="text-sm text-slate-500">{SITE.freshSubtitle}</p>
            </div>
            <Link href="/search" className="text-sm font-semibold text-emerald-700 hover:underline">
              {SITE.freshAllLabel}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {fresh.map((b) => (
              <BusinessTile key={b.id} b={b} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-emerald-200">{label}</div>
    </div>
  )
}

function BusinessTile({ b, locale }: { b: Business; locale: 'en' | 'es' }) {
  const ddesc = pick({ en: b.description_en, es: b.description_es }, locale, b.description)
  return (
    <Link
      href={`/business/${b.slug}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-emerald-500 hover:shadow-sm"
    >
      {b.image_hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={b.image_hero} alt={b.name} className="h-36 w-full object-cover" />
      )}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{b.name}</h3>
          {b.claimed && <span className="text-[11px] font-semibold text-emerald-700">Claimed</span>}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{ddesc}</p>
      </div>
    </Link>
  )
}

