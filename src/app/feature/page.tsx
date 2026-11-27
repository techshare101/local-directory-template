import Link from 'next/link'
import { ArrowLeft, BadgeCheck, Clock, Eye, MapPin, Megaphone, ShieldCheck } from 'lucide-react'
import { FeatureForm } from './FeatureForm'
import { FEATURED_PLANS } from '@/lib/featured'
import { SITE } from '@/lib/site.config'
import { formatSalesWhatsApp, salesWhatsAppHref } from '@/lib/sales-contact'

export const metadata = {
  title: `Get featured in ${SITE.city}`,
  description: `Put your business in front of every visitor to ${SITE.name}. Paid placement, clearly labelled.`,
}

const BENEFITS = [
  {
    icon: Eye,
    title: 'Top of the homepage',
    body: 'Your listing appears in the Featured band above the regular directory — the first thing every visitor sees.',
  },
  {
    icon: MapPin,
    title: 'Pinned in your category',
    body: 'You rank above non-featured listings when someone browses your category or searches.',
  },
  {
    icon: BadgeCheck,
    title: 'Featured badge',
    body: 'A clear badge on your profile that signals an active, maintained business.',
  },
  {
    icon: Megaphone,
    title: 'Offers surface first',
    body: 'Your promotions and events are shown on your profile, ready for the people already looking for you.',
  },
]

export default function FeaturePage() {
  const wa = salesWhatsAppHref(`Hola, quiero destacar mi negocio en ${SITE.city}. ¿Cómo funciona?`)
  const waLabel = formatSalesWhatsApp()

  return (
    <div className="mx-auto max-w-4xl space-y-12 py-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
        <ArrowLeft size={15} /> Back to the directory
      </Link>

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-emerald-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <span className="inline-block rounded-full bg-amber-300/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          Paid placement
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Be the first business people see in {SITE.city}
        </h1>
        <p className="mt-3 max-w-xl text-emerald-100">
          Featured listings sit above the rest of the directory. You pay for position — we never touch
          ratings, reviews, or the order of unpaid results.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#request"
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Request placement
          </a>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-emerald-500 bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300 hover:text-white"
            >
              WhatsApp us {waLabel}
            </a>
          )}
          <span className="rounded-xl border border-emerald-800 px-4 py-3 text-sm text-emerald-200">
            ${FEATURED_PLANS.monthly.price}/month · ${FEATURED_PLANS.quarterly.price}/3 months
          </span>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">What featuring does</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <b.icon className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-3 font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Price</h2>
        <p className="mt-1 text-sm text-slate-500">Simple, time-boxed placement. No lock-in, no hidden fees.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {Object.entries(FEATURED_PLANS).map(([id, p]) => (
            <div
              key={id}
              className={`rounded-2xl border p-6 ${
                id === 'quarterly' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-slate-900">{p.label}</span>
                <span className="text-3xl font-bold text-slate-900">${p.price}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {p.days} days of featured placement, then it expires automatically.
              </p>
              {id === 'quarterly' && (
                <p className="mt-2 text-xs font-semibold text-emerald-700">Save ${FEATURED_PLANS.monthly.price * 3 - p.price}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
            Send the request below with your WhatsApp number.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">2</span>
            We check the listing with you on WhatsApp and send a payment link.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">3</span>
            Within 24 hours of payment your listing goes live as Featured, for the period you paid.
          </li>
        </ol>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          Placement expires on its own — you are never auto-charged and nothing renews silently.
        </p>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-slate-900">How payment works</p>
          <p className="mt-1 text-sm text-slate-600">
            We confirm availability with you on WhatsApp, then send a payment link (card or bank
            transfer). You get a receipt on WhatsApp, and your placement goes live within 24 hours of
            payment. Nothing is charged on this page.
          </p>
        </div>
      </section>

      {/* Request form */}
      <section id="request" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-900">Request placement</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us who you are and we&apos;ll confirm availability in {SITE.city}.
        </p>
        <div className="mt-5">
          <FeatureForm />
        </div>
      </section>

      {/* Honesty */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Our rules for paid placement
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Every paid slot is labelled <strong>Sponsored</strong> — never disguised as organic ranking.</li>
          <li>Payment buys position only. Ratings and reviews come from real customers.</li>
          <li>If a listing is inaccurate or unclaimed, we fix or remove it regardless of payment.</li>
        </ul>
      </section>
    </div>
  )
}
