// AirMate Service Worker
// 탑승 알림을 백그라운드에서도 표시하기 위한 Service Worker

const CACHE_NAME = 'airmate-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// 페이지에서 postMessage로 알림 예약 수신
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATION') {
    const { delayMs, title, body, tag } = event.data
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        tag,
        icon: '/img/여행준비중.png',
        badge: '/img/여행준비중.png',
        requireInteraction: true,
        data: { url: '/' },
      })
    }, delayMs)
  }
})

// 알림 클릭 시 앱 포커스
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('/')
    })
  )
})

// Firebase FCM push (나중에 Firebase 연동 시 활성화)
self.addEventListener('push', (event) => {
  if (!event.data) return
  const payload = event.data.json()
  event.waitUntil(
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/img/여행준비중.png',
      requireInteraction: true,
    })
  )
})
