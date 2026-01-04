const CACHE_NAME = 'finanze-2026-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/movements.html',
  '/charts.html',
  '/settings.html',
  '/style.css',
  '/app.js',
  '/state.js',
  '/storage.js',
  '/chart.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
