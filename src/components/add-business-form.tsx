'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category, Location } from '@/lib/database.types'

export function AddBusinessForm({ categories, locations }: { categories: Category[]; locations: Location[] }) {
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error: err } = await supabase.from('submissions').insert({
      business_name: String(fd.get('businessName') || ''),
      category_id: String(fd.get('category') || '') || null,
      location_id: String(fd.get('location') || '') || null,
      description: String(fd.get('description') || ''),
      website: String(fd.get('website') || ''),
      email: String(fd.get('email') || ''),
    })
    if (err) setError(err.message)
    else setDone(true)
    setBusy(false)
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
        <strong>Submission received.</strong> We&apos;ll review it and list your business shortly.
      </div>
    )
  }

  const inputCls = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        Business name *
        <input name="businessName" required maxLength={140} className={inputCls} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Category *
          <select name="category" required className={inputCls} defaultValue="">
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Location *
          <select name="location" required className={inputCls} defaultValue="">
            <option value="" disabled>Select a location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        Short description
        <textarea name="description" rows={3} maxLength={500} className={inputCls} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Website
          <input name="website" type="url" className={inputCls} />
        </label>
        <label className="block text-sm">
          Email
          <input name="email" type="email" className={inputCls} />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? 'Submitting…' : 'Submit business'}
      </button>
    </form>
  )
}
