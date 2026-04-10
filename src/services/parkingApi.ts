import { fetchAirportApi } from './airportApiBase'

/** 실제 API 응답 필드 */
export interface ParkingLot {
  floor: string       // 구역명 (예: "T1 단기주차장지하1층", "T1 장기 P1 주차장")
  parking: string     // 현재 주차 대수
  parkingarea: string // 총 주차 가능 대수
  datetm: string      // 갱신 시각 (yyyyMMddHHmmss.sss)
}

/** floor 문자열에서 터미널 추출 */
export function lotTerminal(floor: string): 'T1' | 'T2' | null {
  if (floor.startsWith('T1')) return 'T1'
  if (floor.startsWith('T2')) return 'T2'
  return null
}

/** floor 문자열에서 유형 추출 */
export function lotType(floor: string): '단기' | '장기' | '예약' {
  if (floor.includes('단기')) return '단기'
  if (floor.includes('장기')) return '장기'
  return '예약'
}

/** 주차 혼잡도 계산 (parking = 점유 대수, parkingarea = 총 대수) */
export function parkingStatus(parking: string, parkingarea: string) {
  const total = Number(parkingarea)
  const occupied = Number(parking)
  if (total === 0) return { label: '정보없음', color: 'text-brand-muted', pct: 0 }
  const pct = Math.round((occupied / total) * 100)
  if (pct >= 95) return { label: '만차',   color: 'text-brand-red',    pct }
  if (pct >= 80) return { label: '혼잡',   color: 'text-orange-500',   pct }
  if (pct >= 60) return { label: '보통',   color: 'text-yellow-600',   pct }
  return              { label: '여유',   color: 'text-brand-green',  pct }
}

export async function getParkingStatus(): Promise<ParkingLot[]> {
  const base = import.meta.env.VITE_API_PARKING_ICN
  // 실제 operation sub-path 포함
  const data = await fetchAirportApi<ParkingLot>(`${base}/getTrackingParking`)
  return data
}
