const CACHE_NAME = "template-web-shell-v1";
const CACHE_PREFIX = "template-web-shell";
const SHELL = [
  "/",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.webmanifest",
];
const NEVER_CACHE = ["/dashboard", "/login", "/auth/callback"];

// Cached shell requests carry no cookies, so a signed-in page is never stored.
function precacheRequest(path) {
  return new Request(path, { credentials: "omit" });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          SHELL.map((path) => cache.add(precacheRequest(path))),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheFirst(request) {
  const { pathname } = new URL(request.url);

  return (
    pathname === "/manifest.webmanifest" ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/_next/static/") ||
    ["style", "script", "image", "font"].includes(request.destination)
  );
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const { pathname } = new URL(request.url);

  try {
    const response = await fetch(request);

    if (response.ok && pathname === "/") {
      const cache = await caches.open(CACHE_NAME);
      const shell = await fetch(precacheRequest("/")).catch(() => null);

      if (shell && shell.ok) await cache.put("/", shell);
    }

    return response;
  } catch (error) {
    if (NEVER_CACHE.includes(pathname)) throw error;

    const cached = await caches.match("/");
    if (cached) return cached;

    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (!url.protocol.startsWith("http")) return;
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isCacheFirst(request)) event.respondWith(cacheFirst(request));
});
