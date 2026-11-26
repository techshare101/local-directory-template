'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ListingOption {
  slug: string
  name: string
}

export function ClaimForm({ listings }: { listings: ListingOption[] }) {
  const preselected = useSearchParams().get('listing') ?? ''
  const [slug, setSlug] = useState(preselected)
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'error' | 'done'>('idle')

  const selectedName = listings.find((l) => l.slug === slug)?.name ?? ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slug || !contactName.trim() || !phone.trim()) return
    setState('submitting')
    try {
      const res = await fetch('/api/claim/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessSlug: slug, contactName, phone, whatsapp, email, website, notes }),
      })
      if (!res.ok) throw new Error('submit failed')
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Request received!</h2>
        <p className="mt-1 text-sm text-slate-700">
          We review every claim by hand and will get back to you shortly. <strong>{selectedName}</strong> will be
          marked as claimed once verified.
        </p>
      </div>
    )
  }

  const inputCls = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-slate-500">
          Tell us who you are and how to contact you. We verify each request before publishing it.
        </p>
      </div>
      <label className="block text-sm">
        Which business is yours? *
        <select required value={slug} onChange={(e) => setSlug(e.target.value)} defaultValue="" className={inputCls}>
          <option value="" disabled>Choose your business</option>
          {listings.map((l) => (
            <option key={l.slug} value={l.slug}>{l.name}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Your name *
          <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm">
          Phone *
          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm">
          WhatsApp (if different)
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} />
        </label>
        <label className="block text-sm">
          Email (optional)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </label>
      </div>
      <label className="block text-sm">
        Website (optional)
        <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} />
      </label>
      <label className="block text-sm">
        Anything else we should know? (optional)
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
      </label>
      {state === 'error' && <p className="text-sm font-semibold text-red-600">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {state === 'submitting' ? 'Sending…' : 'Claim my business'}
      </button>
    </form>
  )
}
