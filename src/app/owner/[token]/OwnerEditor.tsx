'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, Camera, ExternalLink, ImagePlus, MapPin, Save, Trash2, Upload, Loader2 } from 'lucide-react'
import type { Business } from '@/lib/database.types'
import { DAYS } from '@/lib/hours'

type HoursState = Record<string, { open: string; close: string; closed: boolean }>

const EMPTY_HOURS: HoursState = Object.fromEntries(
  DAYS.map((d) => [d.key, { open: '09:00', close: '18:00', closed: false }]),
)

function initialHours(raw: unknown): HoursState {
  const out: HoursState = { ...EMPTY_HOURS }
  if (raw && typeof raw === 'object') {
    for (const d of DAYS) {
      const row = (raw as Record<string, { open?: string; close?: string; closed?: boolean }>)[d.key]
      if (row) out[d.key] = { open: row.open || '09:00', close: row.close || '18:00', closed: Boolean(row.closed) }
    }
  }
  return out
}

type CompletenessInput = {
  name?: string
  description_es?: string
  description_en?: string
  phone?: string
  whatsapp?: string
  address_es?: string
  address_en?: string
  image_hero?: string
  latitude?: number | null
  website?: string
}

function completeness(b: CompletenessInput, gallery: string[]): number {
  const checks = [
    Boolean(b.name),
    Boolean(b.description_es || b.description_en),
    Boolean(b.phone || b.whatsapp),
    Boolean(b.address_es || b.address_en),
    Boolean(b.image_hero),
    gallery.length > 0 || Boolean(b.image_hero),
    typeof b.latitude === 'number',
    Boolean(b.website),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function OwnerEditor({ token, business }: { token: string; business: Business }) {
  const [form, setForm] = useState({
    name: business.name || '',
    description_es: business.description_es || business.description || '',
    description_en: business.description_en || business.description || '',
    phone: business.phone || '',
    whatsapp: business.whatsapp || '',
    email: business.email || '',
    website: (business.website || '').replace(/^https?:\/\//, ''),
    address_es: business.address_es || business.address || '',
    address_en: business.address_en || business.address || '',
    latitude: business.latitude != null ? String(business.latitude) : '',
    longitude: business.longitude != null ? String(business.longitude) : '',
  })
  const [hours, setHours] = useState<HoursState>(initialHours(business.hours))
  const [hero, setHero] = useState(business.image_hero || '')
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(business.image_gallery) ? business.image_gallery : [],
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [locating, setLocating] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const pct = completeness({ ...business, ...form, latitude: form.latitude ? Number(form.latitude) : null, image_hero: hero }, gallery)

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setMsg(null)
    const uploaded: string[] = []
    try {
      for (const file of Array.from(files).slice(0, 8)) {
        const fd = new FormData()
        fd.append('token', token)
        fd.append('file', file)
        const res = await fetch('/api/owner/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        uploaded.push(data.url)
      }
      if (!hero && uploaded[0]) setHero(uploaded[0])
      setGallery((g) => [...g, ...uploaded].slice(0, 8))
      setMsg({ kind: 'ok', text: `${uploaded.length} photo${uploaded.length > 1 ? 's' : ''} uploaded — remember to save.` })
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMsg({ kind: 'err', text: 'Geolocation is not available in this browser.' })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        setLocating(false)
        setMsg({ kind: 'ok', text: 'Location captured — remember to save.' })
      },
      () => {
        setLocating(false)
        setMsg({ kind: 'err', text: 'Could not read your location. You can type the coordinates instead.' })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/owner/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form, hours, image_hero: hero, image_gallery: gallery }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save')
      setMsg({ kind: 'ok', text: 'Saved. Your public profile is updated.' })
    } catch (e2) {
      setMsg({ kind: 'err', text: e2 instanceof Error ? e2.message : 'Could not save' })
    } finally {
      setSaving(false)
    }
  }

  const input =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Dashboard header */}
      <div className="rounded-2xl bg-emerald-950 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Owner dashboard</div>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              {form.name || business.name}
              {business.claimed && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold">
                  <BadgeCheck size={13} /> Claimed
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-emerald-200">
              Manage your listing, photos, hours and contact details. Changes go live immediately.
            </p>
          </div>
          <Link
            href={`/business/${business.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400 hover:text-white"
          >
            <ExternalLink size={15} /> View public profile
          </Link>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span>Profile completeness</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-900">
            <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            msg.kind === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Business info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Business information</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Business name</label>
                <input className={input} value={form.name} onChange={set('name')} required maxLength={120} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Description (Español)</label>
                  <textarea className={input} rows={4} value={form.description_es} onChange={set('description_es')} maxLength={2000} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Description (English)</label>
                  <textarea className={input} rows={4} value={form.description_en} onChange={set('description_en')} maxLength={2000} />
                </div>
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Photos</h2>
                <p className="text-xs text-slate-500">JPEG, PNG or WebP · max 5 MB each · up to 8 photos</p>
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || gallery.length >= 8}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? 'Uploading…' : 'Add photos'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
              />
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-600">Cover photo</div>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {hero ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hero} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Camera size={28} />
                    </div>
                  )}
                </div>
                {hero && (
                  <button type="button" onClick={() => setHero('')} className="text-xs font-semibold text-rose-600 hover:underline">
                    Remove cover
                  </button>
                )}
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="mt-5">
                <div className="text-xs font-semibold text-slate-600">Gallery</div>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {gallery.map((url) => (
                    <div key={url} className="group relative overflow-hidden rounded-xl border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Business photo" className="h-24 w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-1.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setHero(url)}
                          className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800"
                        >
                          Set cover
                        </button>
                        <button
                          type="button"
                          onClick={() => setGallery((g) => g.filter((u) => u !== url))}
                          className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gallery.length === 0 && !hero && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-5 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                <ImagePlus size={26} />
                <span className="text-sm font-semibold">Add your first photo</span>
              </button>
            )}
          </section>

          {/* Hours */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Opening hours</h2>
            <p className="text-xs text-slate-500">Untick “Closed” days you are open, or tick them to hide the times.</p>
            <div className="mt-4 space-y-2">
              {DAYS.map((d) => {
                const row = hours[d.key]
                return (
                  <div key={d.key} className="grid grid-cols-[90px_1fr_1fr_auto] items-center gap-2 sm:grid-cols-[120px_1fr_1fr_auto]">
                    <span className="text-sm font-medium text-slate-700">{d.en}</span>
                    <input
                      type="time"
                      value={row.open}
                      disabled={row.closed}
                      onChange={(e) => setHours((h) => ({ ...h, [d.key]: { ...h[d.key], open: e.target.value } }))}
                      className={`${input} disabled:bg-slate-100 disabled:text-slate-400`}
                    />
                    <input
                      type="time"
                      value={row.close}
                      disabled={row.closed}
                      onChange={(e) => setHours((h) => ({ ...h, [d.key]: { ...h[d.key], close: e.target.value } }))}
                      className={`${input} disabled:bg-slate-100 disabled:text-slate-400`}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={row.closed}
                        onChange={(e) => setHours((h) => ({ ...h, [d.key]: { ...h[d.key], closed: e.target.checked } }))}
                      />
                      Closed
                    </label>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Contact</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Phone</label>
                <input className={input} value={form.phone} onChange={set('phone')} placeholder="+1 809 …" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">WhatsApp</label>
                <input className={input} value={form.whatsapp} onChange={set('whatsapp')} placeholder="+1 809 …" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Email</label>
                <input type="email" className={input} value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Website</label>
                <input className={input} value={form.website} onChange={set('website')} placeholder="yourbusiness.com" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Location</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Address (Español)</label>
                <input className={input} value={form.address_es} onChange={set('address_es')} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Address (English)</label>
                <input className={input} value={form.address_en} onChange={set('address_en')} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Latitude</label>
                  <input className={input} value={form.latitude} onChange={set('latitude')} placeholder="19.81" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Longitude</label>
                  <input className={input} value={form.longitude} onChange={set('longitude')} placeholder="-70.68" />
                </div>
              </div>
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 disabled:opacity-60"
              >
                <MapPin size={15} /> {locating ? 'Locating…' : 'Use my current location'}
              </button>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <p className="text-center text-xs text-slate-500">
            Need help? Reply to the WhatsApp message that delivered this link.
          </p>
        </div>
      </div>
    </form>
  )
}
