import { fetchAirportApi } from './airportApiBase'

export interface CongestionInfo {
  adate: string        // 조회 날짜
  atime: string        // 조회 시간
  line_number: string  // 출국장 라인 번호 (1~5번 등)
  congestion: string   // 혼잡도 (여유/보통/혼잡/매우혼잡)
  wait_time: string    // 예상 대기 시간(분)
}

// 샘플 데이터 (CORS/개발환경 폴백)
const SAMPLE: CongestionInfo[] = [
  { adate: '20260409', atime: '1340', line_number: '1번 라인', congestion: '혼잡',    wait_time: '15' },
  { adate: '20260409', atime: '1340', line_number: '2번 라인', congestion: '보통',    wait_time: '8'  },
  { adate: '20260409', atime: '1340', line_number: '3번 라인', congestion: '여유',    wait_time: '3'  },
  { adate: '20260409', atime: '1340', line_number: '4번 라인', congestion: '매우혼잡', wait_time: '22' },
  { adate: '20260409', atime: '1340', line_number: '5번 라인', congestion: '보통',    wait_time: '7'  },
]

export function congestionColor(level: string) {
  if (level === '여유')    return 'text-brand-green bg-brand-pale'
  if (level === '보통')    return 'text-brand-orange bg-orange-50'
  if (level === '혼잡')    return 'text-brand-red bg-red-50'
  if (level === '매우혼잡') return 'text-white bg-brand-red'
  return 'text-brand-muted bg-brand-surface'
}

export async function getDepartureCongestion(): Promise<CongestionInfo[]> {
  try {
    const base = import.meta.env.VITE_API_DEPARTURE_CONGESTION
    const data = await fetchAirportApi<CongestionInfo>(base, { airport_code: 'ICN' })
    if (data.length > 0) return data
  } catch { /* fall through */ }
  return SAMPLE
}
