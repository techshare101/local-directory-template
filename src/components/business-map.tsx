'use client'

import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import Link from 'next/link'

export interface MapPoint {
  id: string
  slug: string
  lat: number
  lng: number
  name: string
  category: string
  categoryId: string
  address: string
  claimed: boolean
}

// Free OSM raster tiles — no API key, no plan upgrade. For higher scale, swap
// to OpenFreeMap (https://tiles.openfreemap.org/styles/liberty) or MapTiler.
const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm' },
  ],
}

export function BusinessMap({
  points,
  center,
}: {
  points: MapPoint[]
  center?: { lat: number; lng: number }
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const fit = () => {
    const m = mapRef.current
    if (!m || points.length === 0) return
    const bounds = new maplibregl.LngLatBounds()
    points.forEach((p) => bounds.extend([p.lng, p.lat]))
    m.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 600 })
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return
    const map = new maplibregl.Map({
      container: el,
      style: STYLE,
      center: center ?? [points[0]?.lng ?? -71.06, points[0]?.lat ?? 19.81],
      zoom: center ? 13 : 14,
      attributionControl: { compact: true },
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.on('load', () => {
      setLoaded(true)
      fit()
    })
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    const m = mapRef.current
    points.forEach((p) => {
      const marker = new maplibregl.Marker({ color: p.claimed ? '#047857' : '#0f766e' })
        .setLngLat([p.lng, p.lat])
        .setPopup(
          new maplibregl.Popup({ closeButton: false, offset: 22 }).setHTML(
            `<a href="/business/${p.slug}" style="font-weight:600;color:#065f46">${p.name}</a>` +
              (p.category ? `<div style="font-size:12px;color:#64748b">${p.category}${p.claimed ? ' · Claimed' : ''}</div>` : ''),
          ),
        )
        .addTo(m)
      markersRef.current.push(marker)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, points])

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute left-3 top-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
        {points.length} location{points.length === 1 ? '' : 's'} on map
      </div>
      {activeId && (
        <div className="sr-only" aria-live="polite">
          Selected: {points.find((p) => p.id === activeId)?.name}
        </div>
      )}
    </div>
  )
}
