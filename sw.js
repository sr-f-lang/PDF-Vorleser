// Offline-Cache: Beim ersten Besuch werden App und Bibliotheken gespeichert.
// Bei Änderungen an den Dateien die Versionsnummer erhöhen, damit der Cache erneuert wird.
const CACHE = 'pdf-vorleser-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './ort-shim.mjs'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Stimmmodelle (mehrere 100 MB) liegen bereits im Gerät (OPFS) und werden nicht doppelt gecacht.
  if (new URL(event.request.url).hostname === 'huggingface.co') return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(event.request);
      if (hit) return hit;
      try {
        const res = await fetch(event.request);
        if (res && (res.ok || res.type === 'opaque')) cache.put(event.request, res.clone());
        return res;
      } catch (err) {
        if (event.request.mode === 'navigate') return cache.match('./index.html');
        throw err;
      }
    })
  );
});
