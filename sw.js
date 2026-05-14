// ── VERSIÓN — cambia este número en cada deploy ──────────────
// Ejemplo: 'v1.0.1', 'v1.0.2', etc.
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cloro-ppm-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── INSTALL: cachea los assets ────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Activa el nuevo SW inmediatamente sin esperar a que se cierren las tabs
  self.skipWaiting();
});

// ── ACTIVATE: elimina cachés antiguas ─────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  // Toma el control de todos los clientes inmediatamente
  self.clients.claim();
});

// ── FETCH: sirve desde caché, con fallback a red ──────────────
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── MESSAGE: permite forzar la activación desde la página ─────
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
