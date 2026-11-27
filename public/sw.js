/* Minimal service worker: installability + static caching.
   No offline data sync — listings are always fetched fresh. */

const CACHE = 'isabela-static-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Pages: network first, tiny offline fallback (never a stale listing).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;padding:2rem;text-align:center"><h1 style="font-size:1.1rem">You are offline</h1><p style="color:#666">Reconnect to load the directory.</p></body>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          ),
      ),
    )
    return
  }

  // Hashed build assets + icons: cache first (filenames change on every deploy).
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE)
        const hit = await cache.match(request)
        if (hit) return hit
        const res = await fetch(request)
        if (res.ok) cache.put(request, res.clone())
        return res
      })(),
    )
  }
})
