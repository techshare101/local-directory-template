'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function ClaimActions({ claimId }: { claimId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null)
  const [ownerPath, setOwnerPath] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function act(action: 'approve' | 'reject') {
    setBusy(action)
    const res = await fetch(`/api/admin/claims/${claimId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json().catch(() => ({}))
    if (data?.ownerPath) setOwnerPath(data.ownerPath)
    setBusy(null)
    router.refresh()
  }

  const fullUrl = ownerPath ? `${typeof window !== 'undefined' ? window.location.origin : ''}${ownerPath}` : ''

  return (
    <div className="mt-4">
      <div className="flex gap-2">
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

      {ownerPath && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Owner dashboard link — send this over WhatsApp
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <code className="flex-1 break-all rounded bg-white px-2 py-1.5 text-xs text-slate-700">{fullUrl}</code>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(fullUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
