'use client'

import dynamic from 'next/dynamic'

// MapLibre must render client-side only (its worker/WebGL doesn't SSR).
const BusinessMap = dynamic(
  () => import('@/components/business-map').then((m) => m.BusinessMap),
  { ssr: false, loading: () => <div className="h-[520px] w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100" /> },
)

export { BusinessMap }
