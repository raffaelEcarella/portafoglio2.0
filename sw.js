const CACHE="p2-cache";
self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(["./","./index.html"]))
  );
});
