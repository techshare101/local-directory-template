'use client'

import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

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
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

export function SingleMap({
  lat,
  lng,
  name,
  height = 340,
}: {
  lat: number
  lng: number
  name: string
  height?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = new maplibregl.Map({
      container: el,
      style: STYLE,
      center: [lng, lat],
      zoom: 15,
      attributionControl: { compact: true },
    })
    mapRef.current = map

    const marker = new maplibregl.Marker({ color: '#059669' })
      .setLngLat([lng, lat])
      .setPopup(new maplibregl.Popup({ offset: 24 }).setText(name))
      .addTo(map)

    marker.togglePopup()

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, name])

  return <div ref={containerRef} style={{ height }} className="w-full" />
}
