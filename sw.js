self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("p2").then(c=>c.addAll(["./","./app.html"]))
  );
});
