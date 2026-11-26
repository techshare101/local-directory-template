import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import type { Business } from '@/lib/database.types'

export function BusinessCard({ b }: { b: Business }) {
  return (
    <Link
      href={`/business/${b.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-emerald-500 hover:shadow-sm"
    >
      {b.image_hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={b.image_hero}
          alt={b.name}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
            {b.name}
          </h3>
          {b.claimed && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <BadgeCheck size={14} /> Claimed
            </span>
          )}
        </div>
        {b.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{b.description}</p>
        )}
        {b.price_min && <p className="mt-2 text-xs font-semibold text-slate-700">{b.price_min}</p>}
      </div>
    </Link>
  )
}
