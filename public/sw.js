self.addEventListener("install", (event) => {
    console.log("Service Worker yüklendi.");
    event.waitUntil(
        caches.open("v1").then((cache) => {
            return cache.addAll(["/"]); // Ana sayfayı cache'le
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker aktif edildi.");
});
