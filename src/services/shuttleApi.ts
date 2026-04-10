import { fetchAirportApi } from './airportApiBase'

export interface ShuttleBus {
  route_id: string      // 노선 ID
  route_name: string    // 노선명 (T1→T2 등)
  depart_time: string   // 출발 시간
  arrive_time: string   // 도착 시간
  interval: string      // 배차 간격 (분)
  status: string        // 운행 상태
}

const SAMPLE: ShuttleBus[] = [
  { route_id: '1', route_name: 'T1 → T2',        depart_time: '05:00', arrive_time: '05:18', interval: '5',  status: '운행중' },
  { route_id: '2', route_name: 'T2 → T1',        depart_time: '05:00', arrive_time: '05:18', interval: '5',  status: '운행중' },
  { route_id: '3', route_name: 'T1 → 교통센터',   depart_time: '05:00', arrive_time: '05:10', interval: '10', status: '운행중' },
  { route_id: '4', route_name: '교통센터 → T1',   depart_time: '05:00', arrive_time: '05:10', interval: '10', status: '운행중' },
  { route_id: '5', route_name: 'T2 → 교통센터',   depart_time: '05:00', arrive_time: '05:08', interval: '10', status: '운행중' },
]

export async function getShuttleBusInfo(): Promise<ShuttleBus[]> {
  try {
    const base = import.meta.env.VITE_API_SHUTTLE_BUS
    const data = await fetchAirportApi<ShuttleBus>(base)
    if (data.length > 0) return data
  } catch { /* fall through */ }
  return SAMPLE
}
