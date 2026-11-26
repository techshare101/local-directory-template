'use client'

import dynamic from 'next/dynamic'

// MapLibre must render client-side only (its worker/WebGL doesn't SSR).
const SingleMap = dynamic(
  () => import('@/components/single-map').then((m) => m.SingleMap),
  { ssr: false, loading: () => <div className="h-[340px] w-full animate-pulse bg-slate-100" /> },
)

export { SingleMap }
