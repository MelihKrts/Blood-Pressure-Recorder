const CACHE_NAME = 'blood-pressure-recorder-v1';
const DATA_STORE_NAME = 'offline-data';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline',
    '/addTension'
];

// Service Worker yüklendiğinde
self.addEventListener('install', (event) => {
    console.log('PWA installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Eski cache'leri temizleme
self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// Fetch olaylarını dinleme
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Eğer POST isteği gelirse
    if (request.method === 'POST') {
        event.respondWith(handlePostRequest(event));
        return;
    }

    // GET istekleri için cache kontrolü
    event.respondWith(
        caches.match(request).then((response) => {
            return response || fetch(request).catch(() => {
                if (request.destination === 'document') {
                    return caches.match('/offline');
                }
            });
        })
    );
});

// 📌 **POST İsteklerini Offline Kaydetme ve Yönetme**
async function handlePostRequest(event) {
    try {
        return await fetch(event.request);
    } catch (error) {
        // POST isteği başarısızsa, veriyi IndexedDB'ye kaydet
        const clonedRequest = event.request.clone();
        const data = await clonedRequest.json();

        await saveToIndexedDB({
            url: event.request.url,
            method: event.request.method,
            headers: Array.from(event.request.headers.entries()),
            data: data,
            timestamp: Date.now()
        });

        return new Response(
            JSON.stringify({
                success: true,
                offline: true,
                message: 'Veri kaydedildi. İnternet gelince senkronize edilecek.'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// 📌 **IndexedDB'ye veri kaydetme**
async function saveToIndexedDB(offlineData) {
    const db = await openDB();
    const tx = db.transaction(DATA_STORE_NAME, 'readwrite');
    const store = tx.objectStore(DATA_STORE_NAME);
    await store.put(offlineData);
    await tx.complete;
}

// 📌 **IndexedDB açma fonksiyonu**
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OfflineDataDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DATA_STORE_NAME)) {
                db.createObjectStore(DATA_STORE_NAME, { keyPath: 'timestamp' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject('IndexedDB açılamadı');
    });
}
