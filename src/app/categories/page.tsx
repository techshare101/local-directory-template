import Link from 'next/link'
import { getCategories } from '@/lib/data'
import { CATEGORY_ORDER } from '@/lib/directory'
import { CategoryIcon } from '@/components/icons'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()
  const ordered = [...categories].sort(
    (a, b) => (CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id)) || (a.sort_order - b.sort_order)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">All categories</h1>
        <p className="mt-1 text-slate-500">{SITE.categoriesSubtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {ordered.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <CategoryIcon id={c.icon || 'map-pin'} className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-slate-900">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
