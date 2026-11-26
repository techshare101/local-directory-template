import { getCategories } from '@/lib/data'
import { getLocations } from '@/lib/locations'
import { AddBusinessForm } from '@/components/add-business-form'

export const dynamic = 'force-dynamic'

export default async function AddBusinessPage() {
  const [categories, locations] = await Promise.all([getCategories(), getLocations()])
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add your business</h1>
        <p className="mt-1 text-slate-500">
          Get discovered in Villa Isabela. Free listing, no credit card required.
        </p>
      </div>
      <AddBusinessForm categories={categories} locations={locations} />
    </div>
  )
}
