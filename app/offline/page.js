"use client"; // Next.js için client-side bileşen olduğunu belirt
import { useEffect, useState } from "react";
import AddTension from "../addTension/page";

export default function Offline() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        // Başlangıç durumunu belirle
        setIsOnline(navigator.onLine);

        // Çevrimiçi durumu değiştiğinde state'i güncelle
        const handleOnline = () => {
            setIsOnline(true);
            alert("Çevrimiçi olundu, veriler senkronize ediliyor...");
            // Çevrimiçi olduğumuzda senkronizasyonu tetikle
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.sync.register('sync-offline-data')
                        .then(() => console.log("Senkronizasyon planlandı"))
                        .catch(err => console.error("Senkronizasyon hatası:", err));
                });
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            alert("Çevrimdışı olundu, veriler yerel olarak saklanacak");
        };

        // Event listener'ları ekle
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Component unmount olduğunda listener'ları temizle
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Çevrimiçi durumuna bağlı olarak görsel stiller
    const statusClass = isOnline
        ? "bg-green-500 text-white p-2 rounded mb-4"
        : "bg-red-500 text-white p-2 rounded mb-4";

    return (
        <div className="offline-page p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">{isOnline ? "Çevrimiçi Modu" : "Çevrimdışı Modu"}</h1>

            <div id="online-status" className={statusClass}>
                {isOnline
                    ? "✅ Çevrimiçi - Veriler doğrudan sunucuya gönderilecek"
                    : "⚠️ Çevrimdışı - Veriler yerel olarak saklanacak"}
            </div>

            {!isOnline && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="mb-2">Şu anda internet bağlantınız yok, ancak veri girişi yapabilirsiniz.</p>
                    <p>Veri girişi yaptığınızda, bilgiler cihazınızda saklanacak ve internet bağlantısı geldiğinde otomatik olarak gönderilecektir.</p>
                </div>
            )}

            {isOnline && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <p>İnternet bağlantınız var. Girdiğiniz veriler anında sunucuya kaydedilecektir.</p>
                </div>
            )}

            <AddTension />

            {/* Çevrimdışı kaydedilen verilerin durumunu göster (opsiyonel) */}
            <div className="mt-8">
                <button
                    onClick={() => checkOfflineData()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Bekleyen Verileri Kontrol Et
                </button>
            </div>
        </div>
    );

    // Çevrimdışı kaydedilen verileri kontrol etmek için (opsiyonel)
    function checkOfflineData() {
        if ('indexedDB' in window) {
            const request = indexedDB.open('OfflineDataDB', 1);

            request.onsuccess = function(event) {
                const db = event.target.result;
                const tx = db.transaction('offline-data', 'readonly');
                const store = tx.objectStore('offline-data');
                const countRequest = store.count();

                countRequest.onsuccess = function() {
                    alert(`Bekleyen veri sayısı: ${countRequest.result}`);
                };

                tx.oncomplete = function() {
                    db.close();
                };
            };

            request.onerror = function(event) {
                console.error("IndexedDB hatası:", event.target.errorCode);
                alert("Bekleyen veriler kontrol edilemedi");
            };
        } else {
            alert("IndexedDB desteklenmiyor");
        }
    }
}