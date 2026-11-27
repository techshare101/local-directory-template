import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Star } from 'lucide-react'
import { isAdmin } from '@/lib/admin-auth'
import { listFeaturedRequests } from '@/lib/data'
import { SITE } from '@/lib/site.config'
import { FeatureActions } from './FeatureActions'

export const dynamic = 'force-dynamic'

export default async function AdminFeaturedPage() {
  if (!(await isAdmin())) redirect('/admin')

  const [pending, decided] = await Promise.all([
    listFeaturedRequests('pending'),
    listFeaturedRequests(),
  ])
  const recent = decided.filter((r) => r.status !== 'pending').slice(0, 10)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Star className="h-5 w-5 text-amber-500" /> Featured requests
          </h1>
          <p className="text-sm text-slate-500">
            {SITE.shortName} — approve only after payment is received. Approval opens a time-boxed window and pins the listing.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-emerald-700 hover:underline">
          ← Overview
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Pending ({pending.length})</h2>
          <Link href="/feature" className="text-xs font-semibold text-emerald-700 hover:underline">
            View public page →
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No pending requests.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{r.business_name}</p>
                  <p className="text-xs text-slate-500">
                    {r.plan === 'quarterly' ? '3 months · $75' : '1 month · $29'}
                    {r.business_slug ? ` · slug: ${r.business_slug}` : ' · no slug (matches by name)'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.contact_name || '—'} · {r.whatsapp || 'no whatsapp'} {r.email ? `· ${r.email}` : ''}
                  </p>
                  {r.message && <p className="mt-1 max-w-lg text-xs italic text-slate-500">“{r.message}”</p>}
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(r.created_at).toLocaleString()} · request {r.id.slice(0, 8)}
                  </p>
                </div>
                <FeatureActions id={r.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Recently decided
        </h2>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Nothing decided yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3">
                <span className="font-medium text-slate-800">{r.business_name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-400">
        Reminder: there is no automated payment collection yet. Confirm the transfer on WhatsApp, then approve here.
        Placement expiry is automatic — nothing renews by itself.
      </p>
    </div>
  )
}
