import Link from 'next/link'
import { Search } from 'lucide-react'
import { getHome, getFeatured } from '@/lib/data'
import { CATEGORY_ORDER } from '@/lib/directory'
import { SITE } from '@/lib/site.config'
import { CategoryIcon } from '@/components/icons'
import { getLocale, pick } from '@/lib/server-locale'
import { salesWhatsAppHref } from '@/lib/sales-contact'
import type { Business } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// Full-bleed band wrapper: breaks the page into distinct visual zones.
const BAND = '-mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-14'

function SectionHead({
  eyebrow,
  title,
  subtitle,
  allHref,
  allLabel,
}: {
  eyebrow: string
  title: string
  subtitle: string
  allHref: string
  allLabel: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          {eyebrow}
        </span>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link
        href={allHref}
        className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
      >
        {allLabel} →
      </Link>
    </div>
  )
}

export default async function Home() {
  const locale = await getLocale()
  const { categories, businesses, posts, events } = await getHome()
  const featured = await getFeatured(6)

  const counts: Record<string, number> = {}
  for (const b of businesses) {
    if (b.category_id) counts[b.category_id] = (counts[b.category_id] || 0) + 1
  }
  const orderedCategories = [...categories].sort(
    (a, b) => (CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id)) || (a.sort_order - b.sort_order)
  )
  const fresh = businesses.slice(0, 8)
  const now = Date.now()
  const upcomingEvents = events
    .filter((ev) => new Date(ev.starts_at).getTime() >= now)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())

  return (
    <div>
      {/* ============ Hero band ============ */}
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
            <button className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
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

      {/* ============ Categories (white zone) ============ */}
      <section className={BAND}>
        <SectionHead
          eyebrow="Browse"
          title={SITE.browseByCategoryTitle}
          subtitle={SITE.browseByCategorySubtitle}
          allHref="/categories"
          allLabel={SITE.browseAllLabel}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {orderedCategories
            .filter((c) => (counts[c.id] || 0) > 0)
            .map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
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

      {/* ============ Featured placements (paid, dark band) ============ */}
      {featured.length > 0 && (
        <section className={`${BAND} bg-emerald-950`}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-block rounded-full bg-amber-300/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Featured · Sponsored
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Featured this month</h2>
              <p className="mt-1 max-w-2xl text-sm text-emerald-200">
                Local businesses that paid for placement. Paid spots are always labelled — they never change
                ratings or reviews.
              </p>
            </div>
            <Link
              href="/feature"
              className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400 hover:text-white"
            >
              Get featured →
            </Link>
          </div>
          <div className="grid gap-4">
            {featured.map((b) => (
              <FeaturedTile key={b.id} b={b} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ============ Fresh listings (tinted zone) ============ */}
      {fresh.length > 0 && (
        <section className={`${BAND} bg-emerald-50/60`}>
          <SectionHead
            eyebrow="Just added"
            title={SITE.freshTitle}
            subtitle={SITE.freshSubtitle}
            allHref="/search"
            allLabel={SITE.freshAllLabel}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {fresh.map((b) => (
              <BusinessTile key={b.id} b={b} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ============ Local spotlight (white zone) ============ */}
      {posts.length > 0 && (
        <section className={BAND}>
          <SectionHead
            eyebrow="Stories"
            title={SITE.spotlightTitle}
            subtitle={SITE.spotlightSubtitle}
            allHref="/blog"
            allLabel={SITE.spotlightAllLabel}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/10"
              >
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <div className="h-48 w-full bg-emerald-950/90" />
                )}
                <div className="p-5">
                  <div className="text-xs text-slate-500">
                    {new Date(p.published_at).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' · '}
                    <span className="font-medium text-emerald-700">{SITE.city}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-emerald-800">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ Upcoming events (tinted zone) ============ */}
      {upcomingEvents.length > 0 && (
        <section className={`${BAND} bg-emerald-50/60`}>
          <SectionHead
            eyebrow="What's on"
            title={SITE.eventsTitle}
            subtitle={SITE.eventsSubtitle}
            allHref="/events"
            allLabel={SITE.eventsAllLabel}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 6).map((ev) => (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/10"
              >
                {ev.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.cover} alt={ev.title} className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <div className="h-40 w-full bg-emerald-950/90" />
                )}
                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    {new Date(ev.starts_at).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-emerald-800">{ev.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{ev.description}</p>
                  {ev.venue && <div className="mt-2 text-xs text-slate-500">{ev.venue}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ Owner CTA band (dark bookend) ============ */}
      <section className="-mx-4 bg-emerald-950 px-4 py-14 text-center text-white sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Are you a local business owner?</h2>
        <p className="mx-auto mt-2 max-w-xl text-emerald-100">
          Claim your free profile to manage your listing, keep your details up to date, and post
          events — free, no credit card.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/claim"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            {SITE.ctaAddBusiness}
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-500 hover:text-white"
          >
            Search the directory
          </Link>
          {salesWhatsAppHref(`Hola, soy dueño de un negocio en ${SITE.city} y quiero reclamar mi ficha.`) && (
            <a
              href={salesWhatsAppHref(`Hola, soy dueño de un negocio en ${SITE.city} y quiero reclamar mi ficha.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-500 hover:text-white"
            >
              WhatsApp us
            </a>
          )}
        </div>
      </section>
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

function FeaturedTile({ b, locale }: { b: Business; locale: 'en' | 'es' }) {
  const ddesc = pick({ en: b.description_en, es: b.description_es }, locale, b.description)
  return (
    <Link
      href={`/business/${b.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30 sm:flex-row"
    >
      <div className="relative sm:w-72 sm:shrink-0">
        {b.image_hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.image_hero} alt={b.name} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-full" />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 sm:h-full">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow-sm">
              {b.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
          Sponsored
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-800">{b.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{ddesc}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {b.address && <span>{b.address}</span>}
          {b.featured_until && (
            <span className="text-slate-400">
              Featured through{' '}
              {new Date(b.featured_until).toLocaleDateString(locale === 'es' ? 'es-DO' : 'en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
        <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          View profile →
        </span>
      </div>
    </Link>
  )
}

function BusinessTile({ b, locale }: { b: Business; locale: 'en' | 'es' }) {
  const ddesc = pick({ en: b.description_en, es: b.description_es }, locale, b.description)
  return (
    <Link
      href={`/business/${b.slug}`}
      className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/10"
    >
      {b.image_hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={b.image_hero} alt={b.name} className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
      )}
      <div className="p-3">
        <div className="flex items-center gap-2.5">
          {!b.image_hero && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
              {b.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">{b.name}</h3>
            {b.claimed && <span className="shrink-0 text-[11px] font-semibold text-emerald-700">Claimed</span>}
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">{ddesc}</p>
      </div>
    </Link>
  )
}
