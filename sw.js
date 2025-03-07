const CACHE_NAME = 'slimeasy-cache-v1';
const urlsToCache = [
  '/',
  '/login.html',
  '/index.html',
  '/tracker.html',
  '/exercise.html',
  '/styles.css',
  '/script.js',
  '/tracker.js',
  '/exercise.js',
  '/slimeasylogo.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
