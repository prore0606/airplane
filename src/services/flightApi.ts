import sampleData from '../../data/sample_flights_departures.json'

export interface Flight {
  flightId: string
  airline: string
  airlineCode: string
  airportCode: string
  airport: string
  scheduleDatetime: string  // HHMM (실API) 또는 YYYYMMDDHHMMSS (샘플)
  estimatedDatetime: string
  terminalId: string        // T1 | T2
  gateNumber: string
  remark: string
  typeOfFlight: string
}

export type FlightRemark = string

/** HHMM 또는 YYYYMMDDHHMMSS → { date, time } */
export function parseDatetime(raw: string) {
  if (raw.length <= 4) {
    // 실API: "0830" → HHMM만 있는 경우
    return { date: '', time: `${raw.slice(0, 2)}:${raw.slice(2, 4)}` }
  }
  // 샘플: "20260409083000"
  const hh = raw.slice(8, 10)
  const mm = raw.slice(10, 12)
  const date = raw.slice(0, 8)
  return {
    date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
    time: `${hh}:${mm}`,
  }
}

const TERMINAL_MAP: Record<string, string> = {
  P01: 'T1',
  P02: 'T2',
  P03: 'T2', // 탑승동(위성동) → T2 소속
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(item: any): Flight {
  return {
    flightId:          item.flightId,
    airline:           item.airline,
    airlineCode:       item.flightId?.slice(0, 2) ?? '',
    airportCode:       item.airportCode,
    airport:           item.airport,
    scheduleDatetime:  item.scheduleDateTime ?? item.scheduleDatetime ?? '',
    estimatedDatetime: item.estimatedDateTime ?? item.estimatedDatetime ?? '',
    terminalId:        TERMINAL_MAP[item.terminalId] ?? item.terminalId ?? '',
    gateNumber:        item.gatenumber || item.gateNumber || '-',
    remark:            item.remark ?? '',
    typeOfFlight:      item.typeOfFlight ?? '',
  }
}

export function remarkColor(remark: FlightRemark) {
  if (remark === '탑승중' || remark === '탑승준비')  return 'text-brand-green bg-brand-pale'
  if (remark === '지연' || remark === '지연출발')     return 'text-brand-red bg-red-50'
  if (remark === '마감예정' || remark === '탑승마감') return 'text-brand-orange bg-orange-50'
  if (remark === '결항')                             return 'text-white bg-red-500'
  if (remark === '체크인오픈')                       return 'text-blue-600 bg-blue-50'
  return 'text-brand-muted bg-brand-surface'
}

async function fetchFromApi(): Promise<Flight[]> {
  const key = import.meta.env.VITE_DATA_GO_KR_API_KEY
  if (!key) throw new Error('env not set')

  const base = import.meta.env.DEV
    ? '/api/data-go-kr/B551177/StatusOfPassengerFlightsOdp'
    : 'https://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp'

  const params = new URLSearchParams({
    serviceKey: key,
    type: 'json',
    numOfRows: '500',
    pageNo: '1',
    lang: 'K',
    queryType: 'D',
  })

  const res = await fetch(`${base}/getPassengerDeparturesOdp?${params}`, {
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()
  const items = json?.response?.body?.items ?? []
  return items.map(normalizeItem)
}

export async function getDepartureFlights(): Promise<Flight[]> {
  try {
    const flights = await fetchFromApi()
    if (flights.length > 0) return flights
  } catch {
    // CORS / 네트워크 오류 시 샘플 데이터로 폴백
  }

  return (sampleData.response.body.items as object[]).map(normalizeItem)
}
