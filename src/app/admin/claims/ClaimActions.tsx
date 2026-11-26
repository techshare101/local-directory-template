'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ClaimActions({ claimId }: { claimId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null)

  async function act(action: 'approve' | 'reject') {
    setBusy(action)
    await fetch(`/api/admin/claims/${claimId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    router.refresh()
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        disabled={busy !== null}
        onClick={() => act('approve')}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy === 'approve' ? 'Approving…' : 'Approve'}
      </button>
      <button
        disabled={busy !== null}
        onClick={() => act('reject')}
        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
      >
        {busy === 'reject' ? 'Rejecting…' : 'Reject'}
      </button>
    </div>
  )
}
