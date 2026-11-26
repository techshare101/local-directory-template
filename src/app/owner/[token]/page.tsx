import Link from 'next/link'
import { getBusinessByOwnerToken } from '@/lib/owner'
import { OwnerEditor } from './OwnerEditor'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Business dashboard',
  robots: { index: false, follow: false },
}

export default async function OwnerDashboard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const business = await getBusinessByOwnerToken(token)

  if (!business) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-10">
          <h1 className="text-2xl font-bold text-slate-900">This owner link is invalid or expired</h1>
          <p className="mt-2 text-sm text-slate-600">
            Owner links are valid for 90 days. If your listing is already claimed, ask us for a fresh
            link and we will resend it by WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/claim"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Claim your business
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-500"
            >
              Back to the directory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <OwnerEditor token={token} business={business} />
}
