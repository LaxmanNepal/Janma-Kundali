const CACHE = 'janma-kundali-v25';
const OFFLINE_FALLBACK = './index.html';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([OFFLINE_FALLBACK])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (/\.(js|mjs|css|json|webmanifest)$/.test(url.pathname)) {
    event.respondWith(fetch(request, {cache:'no-store'}).then(response => { if (response.ok) { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(request,copy)); } return response; }).catch(() => caches.match(request)));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request, {cache:'no-store'}).then(response => response).catch(() => caches.match(OFFLINE_FALLBACK)));
  }
});