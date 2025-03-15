// Cache version - increment when updating resources
const CACHE_NAME = 'slimeasy-cache-v3';
// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/login.html',
  '/index.html',
  '/dashboard.html',
  '/tracker.html',
  '/exercise.html',
  '/styles.css',
  '/script.js',
  '/tracker.js',
  '/exercise.js',
  '/theme.js',
  '/utils.js',
  '/slimeasylogo.jpg',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Open the cache and put the fetched resource there
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        }).catch(() => {
          // If the network fails, try to return a cached offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  // Handle add-water action
  if (event.action === 'add-water') {
    // Open window and pass action parameter
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientsArr => {
        // If a window exists, focus it and update water count
        const hadWindowToFocus = clientsArr.some(windowClient => {
          if (windowClient.url.includes('tracker.html')) {
            return windowClient.focus().then(() => {
              windowClient.postMessage({
                type: 'ADD_WATER',
                waterCount: event.notification.data.waterCount
              });
              return true;
            });
          }
        });

        // If no window focused, open a new one
        if (!hadWindowToFocus) {
          clients.openWindow('/tracker.html?action=add-water')
            .then(windowClient => windowClient && windowClient.focus());
        }
      })
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientsArr => {
        // Check if already open and focus that
        const hadWindowToFocus = clientsArr.some(windowClient => windowClient.focus());
        // If no window to focus, open new one
        if (!hadWindowToFocus) clients.openWindow('/tracker.html');
      })
    );
  }
});

// Listen for push notifications
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'SlimEasy Reminder',
        body: event.data.text()
      };
    }
  }

  const options = {
    body: data.body || 'Time to check your progress!',
    icon: 'slimeasylogo.jpg',
    badge: 'slimeasylogo.jpg',
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Open App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'SlimEasy', options)
  );
});
