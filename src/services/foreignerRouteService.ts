import { supabase } from './supabaseClient'
import type { Station, Route, RouteStep } from '../types/foreigner'

export async function getStations(): Promise<Station[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data ?? []
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
