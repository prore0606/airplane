export interface Station {
  id: string
  code: string
  name_en: string
  name_ko: string
  line_info: string | null
  icon: string | null
  sort_order: number
}

export interface Route {
  id: string
  from_station_id: string
  to_station_id: string
  transport_method: string
  duration_min: number
  price_krw: number | null
  total_steps: number | null
  is_active: boolean
}

export interface RouteStep {
  id: string
  route_id: string
  step_number: number
  location_stamp: string
  direction: string
  instruction_en: string
  instruction_ja: string | null
  instruction_zh: string | null
  photo_url: string | null
  distance_m: number | null
}

export type Language = 'en' | 'ja' | 'zh'
export type UserMode = 'korean' | 'foreigner'
export type ForeignerTab = 'home' | 'route' | 'map' | 'my'

export type RoutePhase =
  | { phase: 'pick-from' }
  | { phase: 'pick-to'; from: Station }
  | { phase: 'roadview'; from: Station; to: Station; route: Route; steps: RouteStep[] }
  | { phase: 'arrival'; from: Station; to: Station; durationMin: number }
