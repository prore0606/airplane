import { supabase } from './supabaseClient'
import type { Station, Route, RouteStep } from '../types/foreigner'

export const STATIONS: Station[] = [
  { id: '00000000-0000-0000-0000-000000000001', code: 'ICN_T1',     name_en: 'Incheon Airport T1',    name_ko: '인천공항 1터미널', line_info: 'AREX',             icon: '✈️', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000002', code: 'ICN_T2',     name_en: 'Incheon Airport T2',    name_ko: '인천공항 2터미널', line_info: 'AREX',             icon: '✈️', sort_order: 2 },
  { id: '00000000-0000-0000-0000-000000000003', code: 'SEOUL',      name_en: 'Seoul Station',         name_ko: '서울역',           line_info: 'Line 1 / 4 / AREX', icon: '🚉', sort_order: 3 },
  { id: '00000000-0000-0000-0000-000000000004', code: 'HONGDAE',    name_en: 'Hongik Univ. Station',  name_ko: '홍대입구역',        line_info: 'Line 2 / AREX',    icon: '🚉', sort_order: 4 },
  { id: '00000000-0000-0000-0000-000000000005', code: 'MYEONGDONG', name_en: 'Myeongdong Station',    name_ko: '명동역',           line_info: 'Line 4',           icon: '🚉', sort_order: 5 },
]

export async function getStations(): Promise<Station[]> {
  return STATIONS
}

export async function getRoute(
  fromStationId: string,
  toStationId: string,
): Promise<Route | null> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('from_station_id', fromStationId)
    .eq('to_station_id', toStationId)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data
}

export async function getRouteSteps(routeId: string): Promise<RouteStep[]> {
  const { data, error } = await supabase
    .from('route_steps')
    .select('*')
    .eq('route_id', routeId)
    .order('step_number')
  if (error) throw error
  return data ?? []
}
