import Link from 'next/link'
import { SITE } from '@/lib/site.config'

export default function PricingPage() {
  const plans = [    {
      name: 'Free listing',
      price: '$0',
      period: 'forever',
      features: ['Business profile page', 'Contact details & map', 'Owner can claim', 'Listed in search & category pages'],
      cta: 'List your business',
      href: '/add-business',
    },
    {
      name: 'Featured',
      price: '$29',
      period: '/month',
      highlighted: true,
      features: ['Everything in Free', 'Pin to top of category', 'Featured badge & homepage spotlight', 'Offers & promotions show on your profile', 'Monthly stats'],
      cta: 'Go featured',
      href: '/add-business',
    },
  ]
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{SITE.pricingHeadline}</h1>
        <p className="mt-2 text-slate-500">Simple plans to help your business stand out.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-6 ${p.highlighted ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
          >
            <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">{p.price}</span>
              <span className="text-sm text-slate-500">{p.period}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-600">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link
              href={p.href}
              className={`mt-5 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${
                p.highlighted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400">
        MVP preview — recurring billing via Stripe is the next phase and not yet active. Deferring monetization this build.
      </p>
    </div>
  )
}
