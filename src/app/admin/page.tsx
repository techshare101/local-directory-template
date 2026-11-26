import Link from 'next/link'
import { BadgeCheck, Building2, Camera, Inbox, MessageSquareText, ShieldCheck } from 'lucide-react'
import { isAdmin } from '@/lib/admin-auth'
import { getAdminStats } from '@/lib/admin-stats'
import { listClaims } from '@/lib/data'
import { SITE } from '@/lib/site.config'
import { AdminLogin } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminIndexPage() {
  if (!(await isAdmin())) return <AdminLogin />

  const [stats, pending] = await Promise.all([getAdminStats(), listClaims('pending')])

  const cards = [
    { label: 'Total businesses', value: stats.businesses, icon: Building2, href: '/search' },
    { label: 'Claimed listings', value: stats.claimed, icon: BadgeCheck, href: '/admin/claims' },
    { label: 'Pending claims', value: stats.pendingClaims, icon: ShieldCheck, href: '/admin/claims' },
    { label: 'Listings with photos', value: stats.withPhotos, icon: Camera, href: '/search' },
    { label: 'Enquiries', value: stats.enquiries, icon: MessageSquareText, href: '#' },
    { label: 'New submissions', value: stats.submissions, icon: Inbox, href: '#' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500">{SITE.shortName} — operator console</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">
          ← View directory
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{c.label}</span>
              <c.icon size={16} className="text-emerald-600" />
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Pending claims</h2>
            <Link href="/admin/claims" className="text-sm font-semibold text-emerald-700 hover:underline">
              Review all →
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              No pending claims right now.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {pending.slice(0, 6).map((c) => (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <div>
                    <div className="font-semibold text-slate-800">{c.business?.name ?? 'Unknown'}</div>
                    <div className="text-xs text-slate-500">
                      {c.contact_name} · {c.phone || c.whatsapp || c.email}
                    </div>
                  </div>
                  <Link href="/admin/claims" className="text-xs font-semibold text-emerald-700 hover:underline">
                    review →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">How claiming works</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            <li>1. Owner submits the claim form (phone / WhatsApp).</li>
            <li>2. You approve it here.</li>
            <li>3. The system mints a private owner link <code className="rounded bg-slate-100 px-1">/owner/…</code>.</li>
            <li>4. Send that link over WhatsApp — the owner edits profile, hours, location and uploads photos.</li>
          </ol>
          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
            Owner links expire after 90 days and only open one listing. No passwords.
          </div>
        </div>
      </div>
    </div>
  )
}
