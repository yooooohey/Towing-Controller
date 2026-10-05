const CACHE_NAME = 'tow-in-controller-v1.5.4';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

// インストール時にキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// アクティベーション時に古いキャッシュを削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ時にネットワーク優先、オフライン時はキャッシュから応答
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});