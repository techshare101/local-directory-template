import { getCategories, getMapBusinesses, toMapPoint } from '@/lib/data'
import { getLocale } from '@/lib/server-locale'
import { BusinessMap } from '@/components/business-map-dynamic'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const locale = await getLocale()
  const [categories, all] = await Promise.all([getCategories(), getMapBusinesses()])
  const points = all.map((b) => toMapPoint(b, locale))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Businesses map — {SITE.city}</h1>
        <p className="mt-1 text-slate-500">
          <strong>{points.length}</strong> verified locations around {SITE.city}. Click a marker to open its listing.
        </p>
      </div>

      <p className="text-xs text-slate-400">
        Map data © OpenStreetMap contributors · {SITE.name} shows only listed, location-tagged businesses
        ({Math.round((points.length / Math.max(all.length, 1)) * 100)}% coverage of the directory has pinned coordinates).
      </p>

      <BusinessMap points={points} />

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">All mapped businesses</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <a
              key={p.id}
              href={`/business/${p.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                {p.claimed && <span className="text-[11px] font-semibold text-emerald-700">Claimed</span>}
              </div>
              {p.category && <p className="mt-0.5 text-xs text-slate-500">{p.category}</p>}
              {p.address && <p className="mt-1.5 text-xs text-slate-600">{p.address}</p>}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
