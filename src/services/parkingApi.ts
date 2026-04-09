import { fetchAirportApi } from './airportApiBase'

export interface ParkingLot {
  parking_area_no: string    // 주차장 구역 (단기1, 장기1 등)
  parking_occupy: string     // 현재 주차 대수
  parking_total: string      // 총 주차 가능 대수
  datagb: string             // 구분 (단기/장기)
}

const SAMPLE: ParkingLot[] = [
  { parking_area_no: '단기 1주차장',  parking_occupy: '1240', parking_total: '1500', datagb: '단기' },
  { parking_area_no: '단기 2주차장',  parking_occupy: '890',  parking_total: '1200', datagb: '단기' },
  { parking_area_no: '장기 1주차장',  parking_occupy: '2100', parking_total: '3000', datagb: '장기' },
  { parking_area_no: '장기 2주차장',  parking_occupy: '1560', parking_total: '2500', datagb: '장기' },
  { parking_area_no: '화물청사 주차장', parking_occupy: '320',  parking_total: '800',  datagb: '화물' },
]

/** 잔여 비율로 혼잡도 계산 */
export function parkingStatus(occupy: string, total: string) {
  const pct = Math.round((Number(occupy) / Number(total)) * 100)
  if (pct >= 90) return { label: '만차 임박', color: 'text-brand-red', pct }
  if (pct >= 70) return { label: '혼잡',     color: 'text-brand-orange', pct }
  return          { label: '여유',           color: 'text-brand-green', pct }
}

export async function getParkingStatus(): Promise<ParkingLot[]> {
  try {
    const base = import.meta.env.VITE_API_PARKING_ICN
    const data = await fetchAirportApi<ParkingLot>(base, { airport_code: 'ICN' })
    if (data.length > 0) return data
  } catch { /* fall through */ }
  return SAMPLE
}
