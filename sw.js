const CACHE = 'agrolayout-v1';
const TILES = 'agrolayout-tiles-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Cache map tiles for offline use
  if (url.includes('google.com/vt') || url.includes('tile.openstreetmap') || url.includes('cartocdn')) {
    e.respondWith(
      caches.open(TILES).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached || new Response('', {status:503}));
        })
      )
    );
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
