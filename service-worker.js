// 【自爆用】service-worker.js

// インストールされたら即座に待機状態をスキップして起動
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// 起動した瞬間に、スマホ内に保持している過去のキャッシュを全て爆破（削除）する
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// 以降の通信は一切キャッシュを使わず、常にサーバーから最新のファイル(終了画面)を取得する
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
