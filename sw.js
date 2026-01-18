const CACHE_NAME = 'mnemox-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/assets/mnemox-logo.jpg'
];

// Instala o Service Worker e faz cache dos arquivos básicos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Intercepta requisições para servir do cache (Estratégia Cache-First para assets estáticos)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
