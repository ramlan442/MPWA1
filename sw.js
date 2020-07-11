const CACHE_NAME_STATIC = 'static-v1';
const CACHE_NAME_DYNAMIC = 'dynamic-v1';
const urlsToCache = ['/', 'halaman/error.html', 'assets/img/nocache.jpg'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then(function (cache) {
      cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (cacheRes) {
        return (
          cacheRes ||
          fetch(event.request).then(function (fecthRes) {
            return caches.open(CACHE_NAME_DYNAMIC).then(function (cache) {
              cache.put(event.request.url, fecthRes.clone());
              return fecthRes;
            });
          })
        );
      })
      .catch(function () {
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('halaman/error.html');
        }
        if (event.request.url.indexOf('.jpg') > -1 || event.request.url.indexOf('.png') > -1) {
          return caches.match('assets/img/nocache.jpg');
        }
      })
  );
});
