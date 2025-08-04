const CACHE_VERSION = "v1754327253145";
const API_CACHE = "api-" + CACHE_VERSION;
const FONT_CACHE = "fonts-" + CACHE_VERSION;
const IMAGE_CACHE = "images-" + CACHE_VERSION;

self.addEventListener("fetch", function (event) {
  if (event.request.destination === "image") {
    event.respondWith(
      new Promise(function (resolve, reject) {
        caches.match(event.request).then(function (responseFromCache) {
          if (responseFromCache) {
            resolve(responseFromCache);
          } else {
            fetch(event.request)
              .then(function (responseFromNetwork) {
                caches.open(IMAGE_CACHE).then(function (cache) {
                  cache.put(event.request, responseFromNetwork.clone());
                  resolve(responseFromNetwork);
                });
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
      })
    );
  }

  if (event.request.destination === "font") {
    event.respondWith(
      new Promise(function (resolve, reject) {
        caches.match(event.request).then(function (responseFromCache) {
          if (responseFromCache) {
            resolve(responseFromCache);
          } else {
            fetch(event.request)
              .then(function (responseFromNetwork) {
                caches.open(FONT_CACHE).then(function (cache) {
                  cache.put(event.request, responseFromNetwork.clone());
                  resolve(responseFromNetwork);
                });
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
      })
    );
  }

  if (event.request.url.includes("/api/list")) {
    event.respondWith(
      new Promise(function (resolve, reject) {
        caches.match(event.request).then(function (responseFromCache) {
          if (responseFromCache) {
            const now = Date.now();
            const cachedTime = responseFromCache.headers.get("sw-cached-time");
            const cacheAge = cachedTime ? now - parseInt(cachedTime) : Infinity;

            if (cacheAge < 5 * 60 * 1000) {
              // 5 minutes cache
              resolve(responseFromCache);
              return;
            }
          }

          fetch(event.request)
            .then(function (responseFromNetwork) {
              const responseForCache = responseFromNetwork.clone();

              const responseWithTimestamp = new Response(
                responseFromNetwork.body,
                {
                  status: responseFromNetwork.status,
                  statusText: responseFromNetwork.statusText,
                  headers: {
                    ...Object.fromEntries(
                      responseFromNetwork.headers.entries()
                    ),
                    "sw-cached-time": Date.now().toString(),
                  },
                }
              );

              caches.open(API_CACHE).then(function (cache) {
                cache.put(
                  event.request,
                  new Response(responseForCache.body, {
                    status: responseForCache.status,
                    statusText: responseForCache.statusText,
                    headers: {
                      ...Object.fromEntries(responseForCache.headers.entries()),
                      "sw-cached-time": Date.now().toString(),
                    },
                  })
                );
              });

              resolve(responseWithTimestamp);
            })
            .catch(() => {
              if (responseFromCache) {
                resolve(responseFromCache);
              } else {
                resolve(
                  new Response("[]", {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  })
                );
              }
            });
        });
      })
    );
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!cacheName.includes(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("install", function (event) {
  self.skipWaiting();
});
