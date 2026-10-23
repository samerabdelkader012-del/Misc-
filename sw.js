const CACHE = 'mzk-v2';
const FILES = ['./', 'index.html', 'css/style.css', 'js/app.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'favicon-64.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
// network first, so a new version on GitHub shows up right away; cache is the offline fallback
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; }).catch(() => caches.match(r)));
});
