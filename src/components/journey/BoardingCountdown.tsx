import { useState, useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown'
import {
  requestPermission,
  getPermissionStatus,
  scheduleFlightAlerts,
  sendTestNotification,
} from '../../services/notificationService'

interface Props {
  departureHHMM: string | null | undefined
  flightId?: string
}

export default function BoardingCountdown({ departureHHMM, flightId }: Props) {
  const countdown = useCountdown(departureHHMM)
  const [permission, setPermission] = useState<string>(getPermissionStatus())
  const [alertsSet, setAlertsSet] = useState(false)

  // 알림 권한 허용 시 자동 스케줄 등록
  useEffect(() => {
    if (permission === 'granted' && departureHHMM && !alertsSet) {
      scheduleFlightAlerts(departureHHMM)
      setAlertsSet(true)
    }
  }, [permission, departureHHMM, alertsSet])

  async function handleAllowNotification() {
    const ok = await requestPermission()
    setPermission(ok ? 'granted' : 'denied')
    if (ok) sendTestNotification()
  }

  if (!countdown || !departureHHMM) return null

  // 긴급도별 색상
  const urgencyStyle = countdown.isUrgent
    ? 'bg-red-500 text-white'
    : countdown.isBoarding
      ? 'bg-brand-orange text-white'
      : 'bg-brand-pale text-brand-black'

  const ringColor = countdown.isUrgent
    ? 'border-red-500'
    : countdown.isBoarding
      ? 'border-brand-orange'
      : 'border-brand-green'

  return (
    <div className={`rounded-hero border-2 ${ringColor} overflow-hidden`}>

      {/* 카운트다운 헤더 */}
      <div className={`px-5 py-4 ${urgencyStyle}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              {countdown.isPast ? '출발 완료' : countdown.isUrgent ? '🚨 긴급' : countdown.isBoarding ? '🚶 탑승 시작' : '✈️ 출발까지'}
            </p>
            <p className="text-3xl font-black mt-0.5">{countdown.label}</p>
          </div>
          {/* 숫자 강조 */}
          {!countdown.isPast && (
            <div className="text-right opacity-90">
              {countdown.hours > 0 && (
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black">{countdown.hours}</span>
                  <span className="text-sm font-bold mb-1">시간</span>
                  <span className="text-4xl font-black">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="text-sm font-bold mb-1">분</span>
                </div>
              )}
              {countdown.hours === 0 && (
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black">{countdown.minutes}</span>
                  <span className="text-sm font-bold mb-1">분</span>
                </div>
              )}
            </div>
          )}
        </div>

        {flightId && (
          <p className="text-xs opacity-70 mt-1">{flightId} 편</p>
        )}
      </div>

      {/* 알림 설정 바 */}
      <div className="bg-white px-5 py-3 flex items-center justify-between">
        {permission === 'granted' ? (
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-lg">🔔</span>
            <p className="text-sm font-semibold text-brand-black">탑승 알림 설정 완료</p>
            <span className="text-xs text-brand-muted">90·50·30·15분 전 알림</span>
          </div>
        ) : permission === 'denied' ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">🔕</span>
            <p className="text-sm text-brand-muted">브라우저 설정에서 알림을 허용해주세요</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-sm font-semibold text-brand-black">탑승 알림 받기</p>
              <p className="text-xs text-brand-muted">탑승 전 4번 미리 알려드릴게요</p>
            </div>
            <button
              onClick={handleAllowNotification}
              className="bg-brand-green text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-brand-dark transition-colors shrink-0"
            >
              알림 허용
            </button>
          </>
        )}
      </div>
    </div>
  )
}
