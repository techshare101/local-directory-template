import { getClaimableListings } from '@/lib/data'
import { ClaimForm } from '@/components/claim-form'
import { SITE } from '@/lib/site.config'

export const dynamic = 'force-dynamic'

export default async function ClaimPage() {
  const listings = await getClaimableListings()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Claim your business</h1>
        <p className="mt-2 text-slate-500">
          {SITE.name} is free for local businesses. Claiming your listing lets you control your real information —
          phone, hours, WhatsApp and location — so neighbours and visitors find you.
        </p>
      </div>
      <ClaimForm listings={listings} />
    </div>
  )
}
