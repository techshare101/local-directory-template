import Link from 'next/link'
import { getCategories, searchBusinesses } from '@/lib/data'
import { BusinessCard } from '@/components/business-card'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const sp = await searchParams
  const q = sp.q || ''
  const cat = sp.cat || ''
  const [categories, businesses] = await Promise.all([
    getCategories(),
    searchBusinesses(q, cat),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Search directory</h1>
        <p className="mt-1 text-slate-500">Found <strong>{businesses.length}</strong> business{businesses.length === 1 ? '' : 'es'}</p>
      </div>

      <form action="/search" className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search for a business…"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
        />
        <select name="cat" defaultValue={cat} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Search
        </button>
      </form>

      {businesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          No businesses match. Try a different search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <BusinessCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </div>
  )
}
