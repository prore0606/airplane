import sampleData from '../../data/sample_flights_departures.json'

export interface Flight {
  flightId: string
  airline: string
  airlineCode: string
  airportCode: string
  airport: string
  scheduleDatetime: string
  estimatedDatetime: string
  terminalId: string
  gateNumber: string
  remark: string
  typeOfFlight: string
}

export type FlightRemark =
  | '정시출발' | '지연출발' | '탑승중' | '출발준비' | '출발예정' | '출발완료' | string

/** YYYYMMDDHHMMSS → { date, time } */
export function parseDatetime(raw: string) {
  const date = raw.slice(0, 8)
  const hh = raw.slice(8, 10)
  const mm = raw.slice(10, 12)
  return {
    date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
    time: `${hh}:${mm}`,
  }
}

export function remarkColor(remark: FlightRemark) {
  if (remark === '탑승중') return 'text-brand-green bg-brand-pale'
  if (remark === '지연출발') return 'text-brand-red bg-red-50'
  if (remark === '출발준비') return 'text-brand-orange bg-orange-50'
  return 'text-brand-muted bg-brand-surface'
}

async function fetchFromApi(): Promise<Flight[]> {
  const key = import.meta.env.VITE_DATA_GO_KR_API_KEY
  if (!key) throw new Error('env not set')

  // 개발 환경: Vite 프록시로 CORS 우회 / 프로덕션: 직접 호출
  const base = import.meta.env.DEV
    ? '/api/data-go-kr/B551177/StatusOfPassengerFlightsOdp'
    : 'https://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp'

  const params = new URLSearchParams({
    serviceKey: key,
    type: 'json',
    numOfRows: '100',
    pageNo: '1',
    lang: 'K',
    queryType: 'D',
  })

  const res = await fetch(`${base}/getOdpFlightInfo?${params}`, {
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()
  return json?.response?.body?.items ?? []
}

export async function getDepartureFlights(): Promise<Flight[]> {
  try {
    const flights = await fetchFromApi()
    if (flights.length > 0) return flights
  } catch {
    // fall through to sample data
  }

  // Use bundled sample data when API is unreachable (CORS / dev environment)
  return sampleData.response.body.items as Flight[]
}
