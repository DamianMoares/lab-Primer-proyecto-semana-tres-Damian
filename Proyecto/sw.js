/**
 * ========================================
 * SERVICE WORKER - Caching y Offline
 * ========================================
 * Mejora performance con caching y soporte offline
 */

// Usar timestamp para invalidar cache automáticamente cada vez que SW se actualiza
const CACHE_VERSION = 'circle-v1-' + new Date().getTime();
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
  // Forzar que el nuevo SW se active inmediatamente
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('✓ Cache creado:', CACHE_VERSION);
        // Cachear archivos críticos
        return cache.addAll(ASSETS_TO_CACHE.slice(0, 10));
      })
      .catch((err) => console.error('Error en cache:', err))
  );
});

// Activar SW y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('Caches encontrados:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar todos los caches anteriores
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Limpiando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Reclamar clientes para que usen el nuevo SW inmediatamente
  self.clients.claim();
});

// Estrategia: Network first con fallback a cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // No cachear cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Estrategia: Network first para JS/CSS (SIEMPRE intentar actualizar)
  if (request.url.includes('/JavaScript/') || request.url.includes('/css/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la red funciona, cachear la nueva versión
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Solo usar cache si falla la red
          return caches.match(request);
        })
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
              if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_VERSION).then((cache) => {
                  cache.put(request, clone);
                });
              }
              return response;
            });
        })
        .catch(() => {
          return new Response('Recurso no disponible offline', {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        })
    );
    return;
  }

  // Estrategia: Network first para HTML
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la red funciona, cachear la nueva versión
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, usar cache
        return caches.match(request)
          .then((response) => {
            return response || caches.match('/index.html');
          });
      })
  );
});
