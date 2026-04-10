import { useState, useEffect } from 'react'

export interface CountdownState {
  totalMinutes: number   // 출발까지 남은 총 분
  hours: number          // 시간 부분
  minutes: number        // 분 부분
  isBoarding: boolean    // 탑승 시작 (출발 45분 전 이내)
  isUrgent: boolean      // 긴급 (출발 20분 전 이내)
  isPast: boolean        // 출발 시각 지남
  label: string          // "2시간 30분 후 출발" 형태 문자열
}

/** HHMM → 오늘(또는 내일) 해당 시각의 ms */
function toTimestampMs(hhmm: string): number {
  const h = parseInt(hhmm.slice(0, 2), 10)
  const m = parseInt(hhmm.slice(2, 4), 10)
  const now = new Date()
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0)
  if (t.getTime() < Date.now()) t.setDate(t.getDate() + 1)
  return t.getTime()
}

function compute(departureMs: number): CountdownState {
  const diffMs = departureMs - Date.now()
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const isPast = diffMs <= 0
  const isBoarding = !isPast && totalMinutes <= 45
  const isUrgent = !isPast && totalMinutes <= 20

  let label = ''
  if (isPast) {
    label = '출발 완료'
  } else if (hours > 0) {
    label = `${hours}시간 ${minutes}분 후 출발`
  } else {
    label = `${minutes}분 후 출발`
  }

  return { totalMinutes, hours, minutes, isBoarding, isUrgent, isPast, label }
}

/**
 * 탑승 카운트다운 훅
 * @param departureHHMM  "1430" 형태의 출발 시각 (없으면 null)
 */
export function useCountdown(departureHHMM: string | null | undefined): CountdownState | null {
  const [state, setState] = useState<CountdownState | null>(null)

  useEffect(() => {
    if (!departureHHMM || departureHHMM.length < 4) {
      setState(null)
      return
    }

    const departureMs = toTimestampMs(departureHHMM)
    setState(compute(departureMs))

    const id = setInterval(() => {
      setState(compute(departureMs))
    }, 30_000) // 30초마다 업데이트

    return () => clearInterval(id)
  }, [departureHHMM])

  return state
}
