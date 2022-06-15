const cacheKey = 'myCache-v1';
const RUNTIME = 'runtime';
const preCacheAssets = [
    '/exp-serviceworker/',
    '/exp-serviceworker/index.html',
    '/exp-serviceworker/css/main.css',
    '/exp-serviceworker/images/image1.png',
    '/exp-serviceworker/js/jquery.min.js',
    '/exp-serviceworker/js/main.js'
]
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheKey)
            .then(
                (cache) => {
                    return cache.addAll(
                        preCacheAssets
                    )
                }
            )
            .then(self.skipWaiting())
    )
})

self.addEventListener('activate', event => {
    const currentCaches = [cacheKey, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(
            (response) => {
                if (response) {
                    return response;
                }
                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            }));
})