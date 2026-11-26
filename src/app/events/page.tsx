import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('isabela_events')
    .select('*, isabela_businesses(name)')
    .order('starts_at', { ascending: true })
  const list = events ?? []
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upcoming events</h1>
        <p className="mt-1 text-slate-500">Don&apos;t miss what&apos;s happening in Villa Isabela.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ev) => (
          <Link key={ev.id} href={`/events/${ev.id}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-emerald-500">
            {ev.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ev.cover} alt={ev.title} className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <div className="text-xs font-semibold text-emerald-700">
                {new Date(ev.starts_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <h2 className="mt-1 font-semibold text-slate-900">{ev.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{ev.description}</p>
              <div className="mt-2 text-xs text-slate-500">{ev.venue || (ev as any).businesses?.name || ''}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
