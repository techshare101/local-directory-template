import { getBusinesses } from '@/lib/data'
import { BusinessCard } from '@/components/business-card'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function NewPage() {
  const businesses = await getBusinesses()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">New businesses</h1>
        <p className="mt-1 text-slate-500">{SITE.newListingsSubtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b) => (
          <BusinessCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  )
}
