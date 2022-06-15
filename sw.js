const cacheKey = 'myCache-v1';
const RUNTIME = 'runtime';
const preCacheAssets = [
    '/',
    'index.html',
    '/css/main.css',
    '/images/image1.png',
    '/js/jquery.min.js',
    '/js/main.js'
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