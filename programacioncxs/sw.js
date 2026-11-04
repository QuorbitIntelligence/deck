/* Programación Noor Cirugías · app instalable (service worker)
   Guarda solo la "cáscara" de la app (esta página e íconos) para que abra rápido.
   La plataforma (Google Apps Script) siempre se carga en línea, así que siempre está actualizada. */
const CACHE = 'programacion-noor-app-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icono-180.png', './icono-192.png', './icono-512.png', './icono-maskable-512.png', './favicon.ico'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return; // Google no se intercepta
  if (req.mode === 'navigate') {
    // Página de entrada: primero en línea (para recibir cambios), si no hay red, la guardada
    e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copia)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
