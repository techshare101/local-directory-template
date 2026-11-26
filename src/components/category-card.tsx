import Link from 'next/link'
import { CategoryIcon } from '@/components/icons'
import type { Category } from '@/lib/database.types'

export async function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600">
        <CategoryIcon id={category.icon || 'map-pin'} className="h-6 w-6" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900">{category.name}</span>
        <span className="text-xs text-slate-500">
          {count > 0 ? `${count} business${count === 1 ? '' : 'es'}` : 'Listing'}
        </span>
      </span>
    </Link>
  )
}
