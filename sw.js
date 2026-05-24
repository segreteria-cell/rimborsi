// SuperbaNuoto Service Worker - Gestione notifiche push
const CACHE_NAME = 'superba-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Gestisce la notifica push ricevuta dal server
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'SuperbaNuoto', {
      body: data.body || '',
      icon: 'https://qfnczjhbgcpczrweyzzt.supabase.co/storage/v1/object/public/allegati/Logo_Superba_Nuoto_orizz_a_colori_jpg-removebg-preview.png',
      badge: 'https://qfnczjhbgcpczrweyzzt.supabase.co/storage/v1/object/public/allegati/Logo_Superba_Nuoto_orizz_a_colori_jpg-removebg-preview.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'superba-notifica',
      requireInteraction: true,
      data: { url: data.url || 'https://rimborsi-nine.vercel.app' }
    })
  );
});

// Al click sulla notifica apre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://rimborsi-nine.vercel.app';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('rimborsi-nine.vercel.app') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
