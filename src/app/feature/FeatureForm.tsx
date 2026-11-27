'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { FEATURED_PLANS, type FeaturedPlanId } from '@/lib/featured'

export function FeatureForm() {
  const [plan, setPlan] = useState<FeaturedPlanId>('monthly')
  const [form, setForm] = useState({ businessName: '', businessSlug: '', contactName: '', whatsapp: '', email: '', message: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/feature/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-3 text-lg font-bold text-slate-900">Request received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          We review every placement by hand. You&apos;ll get a WhatsApp message with the payment link —
          your listing goes live as Featured within 24 hours of payment.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Business name *</span>
          <input
            required
            value={form.businessName}
            onChange={set('businessName')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="Colmado Junior"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">WhatsApp number *</span>
          <input
            required
            value={form.whatsapp}
            onChange={set('whatsapp')}
            inputMode="tel"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="+1 809 000 0000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Your name</span>
          <input
            value={form.contactName}
            onChange={set('contactName')}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="Who should we speak to"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email (optional)</span>
          <input
            value={form.email}
            onChange={set('email')}
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="owner@example.com"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm font-semibold text-slate-700">Plan</span>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(Object.keys(FEATURED_PLANS) as FeaturedPlanId[]).map((id) => {
            const p = FEATURED_PLANS[id]
            const active = plan === id
            return (
              <button
                type="button"
                key={id}
                onClick={() => setPlan(id)}
                className={`rounded-xl border p-4 text-left transition ${
                  active ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-slate-900">{p.label}</span>
                  <span className="text-lg font-bold text-slate-900">${p.price}</span>
                </div>
                <span className="mt-1 block text-xs text-slate-500">
                  {id === 'quarterly' ? 'Best value — save $12' : 'Renews monthly, cancel anytime'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-700">Anything we should know?</span>
        <textarea
          value={form.message}
          onChange={set('message')}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          placeholder="Best time to call, what you sell, current opening hours…"
        />
      </label>

      {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <button
        disabled={state === 'sending'}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        Request placement — ${FEATURED_PLANS[plan].price}
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        No card is charged on this form. We confirm by WhatsApp first, then send a payment link.
      </p>
    </form>
  )
}
