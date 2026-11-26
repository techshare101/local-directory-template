export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}
