/**
 * AirMate 탑승 알림 서비스
 *
 * 흐름:
 *   항공편 등록 → requestPermission() → scheduleFlightAlerts(hhmm)
 *   → Service Worker postMessage로 알림 예약
 *   → 탑승 90 / 50 / 30 / 15분 전에 OS 알림 발송
 */

/** 출발 N분 전 알림 정의 */
const ALERTS = [
  {
    minutesBefore: 90,
    title: '✈️ 면세점 마지막 기회!',
    body: '탑승까지 90분 남았어요. 면세점 쇼핑을 마무리하세요.',
    tag: 'airmate-90',
  },
  {
    minutesBefore: 50,
    title: '🚶 탑승구로 이동하세요',
    body: '탑승이 곧 시작됩니다. 지금 게이트로 이동하세요!',
    tag: 'airmate-50',
  },
  {
    minutesBefore: 30,
    title: '⚠️ 탑승 마감 30분 전',
    body: '서두르세요! 게이트에서 탑승 확인 중입니다.',
    tag: 'airmate-30',
  },
  {
    minutesBefore: 15,
    title: '🚨 즉시 게이트로!',
    body: '탑승 마감까지 15분! 지금 당장 이동하세요.',
    tag: 'airmate-15',
  },
]

/** HHMM(예: "1430") → 오늘(또는 내일) 해당 시각의 ms timestamp */
function toTimestampMs(hhmm: string): number {
  const h = parseInt(hhmm.slice(0, 2), 10)
  const m = parseInt(hhmm.slice(2, 4), 10)
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0)
  // 이미 지난 시각이면 내일로
  if (target.getTime() < Date.now()) target.setDate(target.getDate() + 1)
  return target.getTime()
}

/** 알림 권한 요청 — true: 허용, false: 거부/미지원 */
export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

/** 현재 알림 권한 상태 */
export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

/** Service Worker 등록 (앱 시작 시 1회 호출) */
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch (e) {
    console.warn('[AirMate] SW 등록 실패:', e)
  }
}

/** SW에 알림 예약 메시지 전송 */
function postToSW(payload: {
  type: string
  delayMs: number
  title: string
  body: string
  tag: string
}) {
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage(payload)
  })
}

/** 탑승 알림 스케줄 등록 */
export function scheduleFlightAlerts(departureHHMM: string): void {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') return

  const departureMs = toTimestampMs(departureHHMM)

  for (const alert of ALERTS) {
    const fireAt = departureMs - alert.minutesBefore * 60 * 1000
    const delayMs = fireAt - Date.now()
    if (delayMs < 0) continue // 이미 지난 알림은 건너뜀

    postToSW({
      type: 'SCHEDULE_NOTIFICATION',
      delayMs,
      title: alert.title,
      body: alert.body,
      tag: alert.tag,
    })
  }
}

/** 즉시 테스트 알림 (개발용) */
export function sendTestNotification(): void {
  if (Notification.permission !== 'granted') return
  new Notification('✈️ AirMate 알림 테스트', {
    body: '탑승 알림이 정상적으로 설정되었습니다!',
    icon: '/img/여행준비중.png',
  })
}
