// self.addEventListener('install', e => console.log('pwa installed.'));
// self.addEventListener('fetch', event => {});

// sw.js - Offline veri senkronizasyonu için PWA Service Worker

const CACHE_NAME = 'blood-pressure-recorder-v1';
const DATA_STORE_NAME = 'offline-data';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline',
    // Diğer CSS, JS ve resim dosyalarınızı buraya ekleyin
];

// Service Worker yüklendiğinde çalışır
self.addEventListener('install', (event) => {
    console.log('PWA installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

// Service Worker aktif olduğunda çalışır
self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    // Eski cache'leri temizle
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Ağ isteklerini yakalamak için
self.addEventListener('fetch', (event) => {
    // API istekleri için özel işlem
    if (event.request.url.includes('/api/')) {
        event.respondWith(handleApiRequest(event));
    } else {
        // Normal istekler için cache-first stratejisi
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        // Cache'te varsa oradan döndür
                        return response;
                    }

                    // Cache'te yoksa fetch et ve cache'e ekle
                    return fetch(event.request)
                        .then((response) => {
                            // Geçerli bir yanıt olup olmadığını kontrol et
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // Yanıtı cache'e ekle
                            let responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        })
                        .catch(() => {
                            // Sayfa isteği ise offline sayfasına yönlendir
                            if (event.request.mode === 'navigate') {
                                return caches.match('/offline');
                            }
                            // Diğer istekler için boş yanıt
                            return new Response('', {
                                status: 408,
                                statusText: 'İnternet bağlantısı yok'
                            });
                        });
                })
        );
    }
});

// API isteklerini yönetme fonksiyonu
async function handleApiRequest(event) {
    try {
        // Önce normal olarak isteği göndermeyi dene
        return await fetch(event.request);
    } catch (error) {
        // İnternet bağlantısı yoksa
        if (event.request.method === 'POST') {
            try {
                // POST isteğini offline veritabanına kaydet
                const clonedRequest = event.request.clone();
                const data = await clonedRequest.json();

                await saveToIndexedDB({
                    url: event.request.url,
                    method: event.request.method,
                    headers: Array.from(event.request.headers.entries()),
                    data: data,
                    timestamp: Date.now()
                });

                // Başarılı bir yanıt döndür
                return new Response(JSON.stringify({
                    success: true,
                    offline: true,
                    message: 'Veri kaydedildi ve internet bağlantısı geldiğinde gönderilecek'
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (err) {
                console.error('Offline veri kaydedilemedi:', err);

                // Hata yanıtı döndür
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Offline veri kaydedilemedi'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            // GET istekleri için cache'ten yanıt vermeyi dene
            return caches.match(event.request);
        }
    }
}

// IndexedDB'ye veri kaydetme fonksiyonu
async function saveToIndexedDB(offlineData) {
    const db = await openDB();
    const tx = db.transaction(DATA_STORE_NAME, 'readwrite');
    const store = tx.objectStore(DATA_STORE_NAME);
    await store.put(offlineData);
    await tx.complete;
}

// IndexedDB açma fonksiyonu
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OfflineDataDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DATA_STORE_NAME)) {
                db.createObjectStore(DATA_STORE_NAME, { keyPath: 'timestamp' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('IndexedDB açılamadı:', event.target.error);
            reject('IndexedDB açılamadı');
        };
    });
}

// Offline verileri senkronize etme
async function syncOfflineData() {
    const db = await openDB();
    const tx = db.transaction(DATA_STORE_NAME, 'readonly');
    const store = tx.objectStore(DATA_STORE_NAME);
    const items = await store.getAll();

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
        try {
            // İsteğin orijinal headers'ını yeniden oluştur
            const headers = new Headers();
            item.headers.forEach(([key, value]) => headers.append(key, value));

            // Fetch ile isteği yeniden gönder
            const response = await fetch(item.url, {
                method: item.method,
                headers: headers,
                body: JSON.stringify(item.data),
            });

            if (response.ok) {
                // Başarılı olunca veritabanından sil
                const deleteTx = db.transaction(DATA_STORE_NAME, 'readwrite');
                const deleteStore = deleteTx.objectStore(DATA_STORE_NAME);
                await deleteStore.delete(item.timestamp);
                await deleteTx.complete;
                successCount++;
            } else {
                failCount++;
            }
        } catch (error) {
            console.error('Veri senkronizasyonu başarısız:', error);
            failCount++;
        }
    }

    console.log(`Senkronizasyon tamamlandı: ${successCount} başarılı, ${failCount} başarısız`);

    // Tüm istekler başarılı olduysa bildirim göster
    if (successCount > 0 && failCount === 0) {
        self.registration.showNotification('Veri Senkronizasyonu', {
            body: `${successCount} veri başarıyla senkronize edildi.`,
            icon: '/icons/icon-192x192.png'
        });
    }
}

// Senkronizasyon olayını dinle
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-offline-data') {
        event.waitUntil(syncOfflineData());
    }
});

// Çevrimiçi olduğunda senkronizasyon için
self.addEventListener('online', () => {
    // Senkronizasyon API'sini destekliyorsa
    if ('SyncManager' in self) {
        self.registration.sync.register('sync-offline-data');
    } else {
        // Desteklemiyorsa manuel senkronizasyon
        syncOfflineData();
    }
});