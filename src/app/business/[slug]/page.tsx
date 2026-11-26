import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, MapPin, Phone, Mail, Globe, Clock, Tag, CalendarDays, FileText } from 'lucide-react'
import { getBusinessBySlug } from '@/lib/data'
import { EnquiryForm } from '@/components/enquiry-form'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getBusinessBySlug(slug)
  if (!data) return { title: 'Business not found' }
  return { title: data.business.name, description: data.business.description }
}

async function getData({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return getBusinessBySlug(slug)
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getData({ params })
  if (!data) notFound()
  const { business: b, category, location, offers, posts, events } = data

  const services: string[] = Array.isArray(b.services)
    ? b.services.filter((s: unknown): s is string => Boolean(s))
    : []

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900">
        {b.image_hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.image_hero} alt={b.name} className="h-64 w-full object-cover opacity-70" />
        ) : (
          <div className="h-64 w-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute bottom-0 w-full p-6">
          <div className="flex items-center gap-2">
            <Link
              href={`/category/${category?.id || ''}`}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              {category?.name || 'Business'}
            </Link>
            {location && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
                <MapPin size={12} /> {location.name}
              </span>
            )}
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
            {b.name}
            {b.claimed && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                <BadgeCheck size={13} /> Claimed
              </span>
            )}
          </h1>
          {b.price_min && <p className="mt-1 text-sm text-emerald-200">{b.price_min}</p>}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Quick answers / about */}
          <InfoCard title="About">
            <p className="text-slate-700">{b.description}</p>
            {services.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <span key={s} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </InfoCard>

          {/* Offers */}
          {offers.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900">Current Offers & Promotions</h2>
              <p className="text-sm text-slate-500">{offers.length} offer{offers.length > 1 ? 's' : ''} available</p>
              <div className="mt-4 space-y-3">
                {offers.map((o) => (
                  <div key={o.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <Tag size={15} className="text-amber-600" /> {o.title}
                      </div>
                      {o.price && <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-bold text-white">{o.price}</span>}
                    </div>
                    {o.description && <p className="mt-2 text-sm text-slate-700">{o.description}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {o.code && <span>Code <code className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">{o.code}</code></span>}
                      {o.valid_until && <span>Valid until {o.valid_until}</span>}
                      {o.terms && <span className="italic">· {o.terms}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {events.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900">Events</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {events.map((ev) => (
                  <Link key={ev.id} href={`/events/${ev.id}`} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-500">
                    {ev.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ev.cover} alt={ev.title} className="h-16 w-24 rounded-lg object-cover" />
                    )}
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={12} /> {new Date(ev.starts_at).toLocaleDateString()}</div>
                      <div className="text-sm font-semibold text-slate-900">{ev.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {posts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900">Posts</h2>
              <div className="mt-4 space-y-3">
                {posts.map((p) => (
                  <Link key={p.id} href={`/blog/${p.id}`} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:border-emerald-500">
                    {p.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover} alt={p.title} className="h-16 w-24 rounded-lg object-cover" />
                    )}
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500"><FileText size={12} /> {new Date(p.published_at).toLocaleDateString()}</div>
                      <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <InfoCard title="Contact">
            <ul className="space-y-2 text-sm text-slate-700">
              {b.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={15} className="text-slate-400" />
                  <a href={`tel:${b.phone}`} className="hover:text-emerald-700">{b.phone}</a>
                </li>
              )}
              {b.email && (
                <li className="flex items-center gap-2">
                  <Mail size={15} className="text-slate-400" />
                  <a href={`mailto:${b.email}`} className="hover:text-emerald-700">{b.email}</a>
                </li>
              )}
              {b.website && (
                <li className="flex items-center gap-2">
                  <Globe size={15} className="text-slate-400" />
                  <a href={`https://${b.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">{b.website}</a>
                </li>
              )}
              {b.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 text-slate-400" />
                  <span>{b.address}</span>
                </li>
              )}
            </ul>
          </InfoCard>

          <InfoCard title="Send an enquiry">
            <p className="mb-3 text-sm text-slate-600">Contact {b.name} directly for quotes or questions.</p>
            <EnquiryForm businessId={b.id} businessName={b.name} />
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}
