// Service worker minimo: tiene l'app apribile anche senza rete.
// La pagina viene presa dalla rete quando c'e' (cosi' gli aggiornamenti
// arrivano subito) e dalla cache quando manca.
const CACHE = "testa-libera-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // i dati passano sempre dalla rete: ci pensa Firestore alla cache offline
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("firebaseio.com") || url.hostname.endsWith("gstatic.com")) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
