import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryAndLocations } from '@/lib/data'
import { BusinessCard } from '@/components/business-card'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { category, locations, businesses } = await getCategoryAndLocations(slug)
  if (!category) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/search" className="text-sm font-medium text-emerald-700 hover:underline">← Back to search</Link>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Best {category.name} in {SITE.city}</h1>
        <p className="mt-1 text-slate-500">{category.description}</p>
      </div>

      {locations.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-semibold text-slate-700">Where?</span>
          <Link href={`/category/${slug}`} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">All areas</Link>
          {locations.map((l: { id: string; name: string }) => (
            <Link key={l.id} href={`/search?loc=${l.id}`} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700">
              {l.name}
            </Link>
          ))}
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">No {category.name.toLowerCase()} businesses listed yet.</p>
          <Link href="/add-business" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline">
            Be the first to list →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b: import('@/lib/database.types').Business) => (
            <BusinessCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </div>
  )
}
