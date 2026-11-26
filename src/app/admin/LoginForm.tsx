'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminLogin() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setBusy(false)
    if (res.ok) router.push('/admin/claims')
    else setError('Invalid admin token')
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Admin</h1>
        <p className="text-sm text-slate-500">Enter the admin token to review claims.</p>
      </div>
      <label className="block text-sm">
        Admin token
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  )
}
