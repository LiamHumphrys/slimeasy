// Cache version - increment when updating resources
const CACHE_NAME = 'slimeasy-cache-v8';
// Files to cache for offline functionality
const urlsToCache = [
  './',
  './login.html',
  './index.html',
  './dashboard.html',
  './tracker.html',
  './exercise.html',
  './calendar.html',
  './wearable-settings.html',
  './community.html',
  './scanner.html',
  './contact.html',
  './privacy-policy.html',
  './terms.html',
  './styles.css',
  './footer.css',
  './script.js',
  './tracker.js',
  './exercise.js',
  './theme.js',
  './utils.js',
  './charts.js',
  './gamification.js',
  './export-utils.js',
  './wearable-integration.js',
  './community.js',
  './scanner.js',
  './ai-buddy.js',
  './crypto-utils.js',
  './sync-ui.js',
  './tracker-fixed.js',
  './dark-mode-fix.js',
  './slimeasylogo.jpg',
  './manifest.json'
  // External resources might fail cache, handling them in fetch event
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache what we can, but don't fail on errors
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service worker installation failed:', error);
      })
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
  // Skip cross-origin requests like Google Analytics
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://cdnjs.cloudflare.com') &&
      !event.request.url.startsWith('https://cdn.jsdelivr.net')) {
    return;
  }

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
              // Only cache resources from our origin or trusted CDNs
              if (event.request.url.startsWith(self.location.origin) || 
                  event.request.url.startsWith('https://cdnjs.cloudflare.com') ||
                  event.request.url.startsWith('https://cdn.jsdelivr.net')) {
                cache.put(event.request, responseToCache);
              }
            })
            .catch(err => console.warn('Failed to cache response for', event.request.url, err));
            
          return response;
        }).catch(error => {
          console.warn('Fetch failed:', error);
          // If the network fails, try to return a cached offline page
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          
          // For other requests like images, just return a graceful failure
          return new Response('Network error occurred', {
            status: 408,
            headers: {'Content-Type': 'text/plain'}
          });
        });
      })
      .catch(error => {
        console.error('Error in fetch handler:', error);
        return caches.match('./index.html');
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
          clients.openWindow('./tracker.html?action=add-water')
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
        if (!hadWindowToFocus) clients.openWindow('./tracker.html');
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
