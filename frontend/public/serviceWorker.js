const CACHE_NAME = "stream-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/index.modern-DH85Q0j-.js",
  "/assets/latency-chart-Bj5OSYzg.es-Cdi-fsd-.js",
  "/assets/mml-react.esm-dMdZLMc1.js",
  "/assets/index-Bs5GzjJC.js",
  "/assets/index-DyXHYJRE.css",
  "/assets/stream-chat-icons-DWRBO47D.svg",
  "/assets/assets/stream-chat-icons-BLRMizsT.woff",
  "/assets/stream-chat-icons-C_tSEO3S.ttf",
  "/assets/stream-chat-icons-CVCe0Jge.eot",
  "/i.png",
  "/icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// activate event - পুরনো cache remove করতে পারো এখানে
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (!cacheWhitelist.includes(name)) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});
