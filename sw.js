const CACHE='janma-kundali-v3';
const CORE=['./','./index.html','./assets/css/style.css','./assets/css/matching.css','./assets/js/app.js','./assets/js/astrology.js','./assets/js/bs-date.js','./src/panchanga.js','./src/varga.js','./src/gochar.js','./src/matching.js','./src/matching-ui.js','./data/locations.json','./data/nakshatra.json','./data/panchanga.json','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match('./index.html'))))});
