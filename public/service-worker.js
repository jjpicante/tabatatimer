/* Service worker de la PWA: habilita la instalación en el dispositivo
   y el funcionamiento offline con una estrategia de caché sencilla. */
const CACHE_NAME = "tabata-timer-v1";
const APP_SHELL = [
  ".",
  "index.html",
  "manifest.json",
  "logo192.png",
  "logo512.png",
  "favicon.ico.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo cacheamos GET del mismo origen; el resto (p. ej. YouTube) va directo a la red.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Navegaciones: red primero, con index.html cacheado como respaldo offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("index.html"))
    );
    return;
  }

  // Resto de assets: caché primero, y si no está, red (y se guarda para la próxima).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
