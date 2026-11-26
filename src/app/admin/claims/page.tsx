import { redirect } from 'next/navigation'
import { listClaims } from '@/lib/data'
import { isAdmin } from '@/lib/admin-auth'
import { ClaimActions } from './ClaimActions'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function AdminClaimsPage() {
  if (!(await isAdmin())) redirect('/admin')

  const pending = await listClaims('pending')
  const reviewed = await listClaims('approved')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Claim requests</h1>
          <p className="text-sm text-slate-500">
            {pending.length} pending · approving sets the listing to claimed.
          </p>
        </div>
        <a href="/" className="text-sm font-semibold text-emerald-700 hover:underline">← {SITE.shortName}</a>
      </div>

      {pending.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          No pending claims.
        </div>
      )}

      {pending.map((c) => (
        <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <strong className="text-slate-900">{c.business?.name ?? 'Unknown'}</strong>
            <a
              href={`/business/${c.business?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              view listing →
            </a>
          </div>
          <dl className="mt-3 grid grid-cols-[110px_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-slate-500">Contact</dt><dd className="m-0">{c.contact_name}</dd>
            <dt className="text-slate-500">Phone</dt><dd className="m-0">{c.phone}</dd>
            {c.whatsapp && <><dt className="text-slate-500">WhatsApp</dt><dd className="m-0">{c.whatsapp}</dd></>}
            {c.email && <><dt className="text-slate-500">Email</dt><dd className="m-0">{c.email}</dd></>}
            {c.website && <><dt className="text-slate-500">Website</dt><dd className="m-0">{c.website}</dd></>}
            {c.notes && <><dt className="text-slate-500">Notes</dt><dd className="m-0">{c.notes}</dd></>}
            <dt className="text-slate-500">Submitted</dt>
            <dd className="m-0">{new Date(c.submitted_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</dd>
          </dl>
          <ClaimActions claimId={c.id} />
        </div>
      ))}

      {reviewed.length > 0 && (
        <>
          <h2 className="pt-4 text-sm font-semibold text-slate-500">Recently approved</h2>
          {reviewed.slice(0, 10).map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 py-2 text-sm">
              <span className="text-slate-700">{c.business?.name ?? 'Unknown'}</span>
              <span className="flex items-center gap-3">
                {c.business?.owner_token && (
                  <a
                    href={`/owner/${c.business.owner_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    owner dashboard →
                  </a>
                )}
                <span className="font-semibold text-emerald-600">approved</span>
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
