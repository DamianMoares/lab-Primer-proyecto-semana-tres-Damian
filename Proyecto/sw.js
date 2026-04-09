/**
 * ========================================
 * SERVICE WORKER - Caching y Offline
 * ========================================
 * Mejora performance con caching y soporte offline
 */

const CACHE_NAME = 'circle-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/page/projectPage.html',
  '/page/formulario.html',
  '/page/error404.html',
  '/css/global.css',
  '/css/styleResponsive.css',
  '/css/index.css',
  '/css/projectPage.css',
  '/css/formulario.css',
  '/css/erro404.css',
  '/JavaScript/global.js',
  '/JavaScript/index.js',
  '/JavaScript/projectPage.js',
  '/JavaScript/formulario.js',
  '/JavaScript/error404.js'
];

// Instalar SW y cachear assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✓ Cache creado:', CACHE_NAME);
        // Solo cachear archivos críticos
        return cache.addAll(ASSETS_TO_CACHE.slice(0, 10));
      })
      .catch((err) => console.error('Error en cache:', err))
  );
});

// Activar SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Limpiando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Estrategia: Network first, fallback a cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // No cachear cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Estrategia: Network first para JS/CSS
  if (request.url.includes('/JavaScript/') || request.url.includes('/css/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Estrategia: Cache first para imágenes y assets
  if (request.url.includes('/assets/') || request.url.includes('/images/')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((response) => {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
              return response;
            });
        })
        .catch(() => {
          // Fallback offline
          return new Response('Recurso no disponible offline', {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        })
    );
    return;
  }

  // Estrategia: Cache first para HTML
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
            return response;
          });
      })
      .catch(() => caches.match('/index.html'))
  );
});
