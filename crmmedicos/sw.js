// Service worker mínimo: permite la instalación como app y mantiene la portada disponible sin conexión.
// Nunca guarda en caché el CRM (/exec), así los datos siempre vienen de Drive.
const CACHE = 'crm-portada-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192-v2.png', './icon-512-v2.png', './favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
