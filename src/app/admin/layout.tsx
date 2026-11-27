import { isAdmin } from '@/lib/admin-auth'
import { AdminBar } from './AdminBar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin()
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {authed && <AdminBar />}
        {children}
      </div>
    </div>
  )
}
