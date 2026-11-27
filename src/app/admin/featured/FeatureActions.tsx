'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function FeatureActions({ id }: { id: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'busy'>('idle')
  const [msg, setMsg] = useState('')

  async function act(action: 'approve' | 'reject') {
    setState('busy')
    setMsg('')
    try {
      const res = await fetch(`/api/admin/featured/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMsg(
        action === 'approve'
          ? `Live until ${new Date(data.until).toLocaleDateString()} — /business/${data.slug}`
          : 'Rejected',
      )
      router.refresh()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Failed')
    } finally {
      setState('idle')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          disabled={state === 'busy'}
          onClick={() => act('reject')}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Reject
        </button>
        <button
          disabled={state === 'busy'}
          onClick={() => act('approve')}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {state === 'busy' ? 'Working…' : 'Mark paid & feature'}
        </button>
      </div>
      {msg && <span className="max-w-xs text-right text-[11px] text-slate-500">{msg}</span>}
    </div>
  )
}
