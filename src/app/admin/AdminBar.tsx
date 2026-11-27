'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminBar() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function signOut() {
    setBusy(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
      <span className="font-semibold uppercase tracking-wide">Operator</span>
      <button
        onClick={signOut}
        disabled={busy}
        className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}
