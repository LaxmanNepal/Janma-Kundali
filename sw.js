const CACHE = 'janma-kundali-v6';
const OFFLINE_FALLBACK = './index.html';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add(OFFLINE_FALLBACK)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // HTML/JS/CSS must prefer the newest deployed version. Cached fallback is only for offline use.
  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';
  event.respondWith(
    isNavigation
      ? fetch(event.request).then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          return response;
        }).catch(() => caches.match(event.request).then(c => c || caches.match(OFFLINE_FALLBACK)))
      : caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          return response;
        }))
  );
});
