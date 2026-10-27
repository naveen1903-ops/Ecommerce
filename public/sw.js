/* Basic PWA cache. Only same-origin GET requests without Authorization are cached. */
const CACHE_NAME = 'shopease-shell-v2';
const APP_SCOPE = new URL(self.registration.scope);
const APP_BASE_PATH = APP_SCOPE.pathname.endsWith('/') ? APP_SCOPE.pathname : `${APP_SCOPE.pathname}/`;
const atAppPath = (path) => new URL(path, APP_SCOPE).toString();
const INDEX_URL = atAppPath('index.html');
const APP_SHELL = [
  atAppPath(''),
  INDEX_URL,
  atAppPath('manifest.webmanifest'),
  atAppPath('icons/icon-192.png'),
  atAppPath('icons/icon-512.png'),
  atAppPath('images/margherita-pizza.svg'),
  atAppPath('images/pepperoni-pizza.svg'),
  atAppPath('images/veggie-burger.svg'),
  atAppPath('images/french-fries.svg'),
];

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined)));
  try {
    const htmlResponse = await cache.match(INDEX_URL);
    const html = htmlResponse ? await htmlResponse.text() : '';
    const assetPaths = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)]
      .map((match) => new URL(match[1], APP_SCOPE).toString())
      .filter((url) => new URL(url).origin === APP_SCOPE.origin && new URL(url).pathname.startsWith(APP_BASE_PATH));
    await Promise.all(assetPaths.map((url) => cache.add(url).catch(() => undefined)));
  } catch {
    // Missing optional assets should not prevent the shell from being cached.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== 'GET' ||
    url.origin !== APP_SCOPE.origin ||
    request.headers.has('authorization') ||
    !url.pathname.startsWith(APP_BASE_PATH)
  ) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(INDEX_URL, response.clone());
        return response;
      }
      return (await caches.match(INDEX_URL)) || response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(INDEX_URL)) || Response.error()));
    return;
  }

  const isStaticAsset = /\.(?:js|css|svg|png|webmanifest|woff2?)$/i.test(url.pathname) || url.pathname.includes('/assets/');
  if (isStaticAsset) {
    event.respondWith(caches.match(request).then(async (cached) => {
      if (cached) return cached;
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    }));
  }
});
