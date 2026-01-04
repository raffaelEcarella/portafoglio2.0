const CACHE_NAME = "portafoglio2_cache_v1";
const urlsToCache = ["./","./index.html","./style.css","./app.js","./ui.js","./state.js","./storage.js","./chart.js"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
