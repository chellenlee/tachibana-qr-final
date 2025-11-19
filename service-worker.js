// 1. キャッシュの名前（バージョン）
// アプリを更新するたびに、ここを 'v3', 'v4'... と書き換えてください
const CACHE_NAME = 'qr-app-cache-v2';

// 2. キャッシュするファイルの一覧
// index.htmlで読み込んでいるURLと「一字一句」同じにする必要があります
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon-192.png',
  // 外部ライブラリ（HTML側の記述と完全に一致させること）
  'https://unpkg.com/@zxing/library@latest',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js'
];

// インストール時：キャッシュを作成してファイルを保存
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// アクティベート時：古いキャッシュ（v1など）を削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // 現在のCACHE_NAMEと違う名前のキャッシュは全て削除
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // 新しいService Workerをすぐにページに適用させる
  return self.clients.claim();
});

// フェッチ（通信）時：キャッシュがあればそれを返す（オフライン対応の要）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. キャッシュに見つかればそれを返す
      if (response) {
        return response;
      }
      // 2. なければネットワークに取りに行く
      return fetch(event.request);
    })
  );
});
