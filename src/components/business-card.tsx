import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import type { Business } from '@/lib/database.types'
import type { Locale } from '@/lib/locale'
import { isFeatured } from '@/lib/featured'

export function BusinessCard({ b, locale = 'en' }: { b: Business; locale?: Locale }) {
  const desc = locale === 'es' ? b.description_es || b.description : b.description
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
        {isFeatured(b) && (
          <span className="mb-2 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950">
            Sponsored
          </span>
        )}
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
        {desc && (
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{desc}</p>
        )}
        {b.price_min && <p className="mt-2 text-xs font-semibold text-slate-700">{b.price_min}</p>}
      </div>
    </Link>
  )
}
