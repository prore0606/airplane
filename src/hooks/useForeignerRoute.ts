import { useState, useEffect } from 'react'
import { getStations, getRoute, getRouteSteps, STATIONS } from '../services/foreignerRouteService'
import type { Station, Route, RouteStep, RoutePhase } from '../types/foreigner'

function makeDemoRoute(fromId: string, toId: string): Route {
  return {
    id: 'demo-route',
    from_station_id: fromId,
    to_station_id: toId,
    transport_method: 'AREX',
    duration_min: 52,
    price_krw: 9500,
    total_steps: 6,
    is_active: true,
  }
}

function makeDemoSteps(from: Station, to: Station, routeId: string): RouteStep[] {
  const fromLabel = from.name_en.toUpperCase().replace(/ /g, ' ')
  const toLabel   = to.name_en.toUpperCase().replace(/ /g, ' ')
  return [
    { id: 'd1', route_id: routeId, step_number: 1, location_stamp: `${fromLabel} · ARRIVAL HALL`,   direction: '↑', instruction_en: 'Walk forward toward the train signs',           instruction_ja: '電車の標識に向かって前進してください',   instruction_zh: '向火车指示牌方向前进',      photo_url: null, distance_m: 50   },
    { id: 'd2', route_id: routeId, step_number: 2, location_stamp: `${fromLabel} · B1 CONCOURSE`,   direction: '↓', instruction_en: 'Take escalator down to AREX platform',          instruction_ja: 'エスカレーターでARexホームへ',           instruction_zh: '乘扶梯下至AREX站台',        photo_url: null, distance_m: null },
    { id: 'd3', route_id: routeId, step_number: 3, location_stamp: `${fromLabel} · AREX TICKET`,    direction: '→', instruction_en: 'Buy ticket at the kiosk on your right',         instruction_ja: '右側の券売機で乗車券を購入',             instruction_zh: '在右侧自动售票机购票',      photo_url: null, distance_m: 20   },
    { id: 'd4', route_id: routeId, step_number: 4, location_stamp: `${fromLabel} · AREX PLATFORM`,  direction: '↑', instruction_en: 'Board AREX train — platform straight ahead',    instruction_ja: 'ARexに乗車 — ホームは正面',             instruction_zh: '乘坐AREX列车 — 站台在前方', photo_url: null, distance_m: 30   },
    { id: 'd5', route_id: routeId, step_number: 5, location_stamp: `${toLabel} · AREX ARRIVAL`,     direction: '↑', instruction_en: 'Exit the train and follow signs to the exit',   instruction_ja: '下車して出口の標識に従ってください',      instruction_zh: '下车后跟随出口指示牌',      photo_url: null, distance_m: null },
    { id: 'd6', route_id: routeId, step_number: 6, location_stamp: `${toLabel} · STREET EXIT`,      direction: '✓', instruction_en: `You've arrived at ${to.name_en}!`,              instruction_ja: `${to.name_en}に到着しました！`,          instruction_zh: `您已到达${to.name_en}！`,   photo_url: null, distance_m: null },
  ]
}

export function useForeignerRoute() {
  const [stations, setStations] = useState<Station[]>([])
  const [phase, setPhase]       = useState<RoutePhase>({ phase: 'pick-from' })
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    getStations().then(setStations).catch(console.error)
  }, [])

  function selectFrom(from: Station) {
    setPhase({ phase: 'pick-to', from })
  }

  async function selectTo(to: Station) {
    if (phase.phase !== 'pick-to') return
    const { from } = phase
    setLoading(true)
    try {
      const route = await getRoute(from.id, to.id)
      const steps = route ? await getRouteSteps(route.id) : []
      if (route && steps.length > 0) {
        setPhase({ phase: 'roadview', from, to, route, steps })
      } else {
        const demoRoute = makeDemoRoute(from.id, to.id)
        setPhase({ phase: 'roadview', from, to, route: demoRoute, steps: makeDemoSteps(from, to, demoRoute.id) })
      }
    } finally {
      setLoading(false)
    }
  }

  async function directTo(toStationCode: string) {
    const from = STATIONS.find(s => s.code === 'ICN_T1')!
    const to   = STATIONS.find(s => s.code === toStationCode)
    if (!to) return
    setLoading(true)
    try {
      const route = await getRoute(from.id, to.id)
      const steps = route ? await getRouteSteps(route.id) : []
      if (route && steps.length > 0) {
        setPhase({ phase: 'roadview', from, to, route, steps })
      } else {
        const demoRoute = makeDemoRoute(from.id, to.id)
        setPhase({ phase: 'roadview', from, to, route: demoRoute, steps: makeDemoSteps(from, to, demoRoute.id) })
      }
    } finally {
      setLoading(false)
    }
  }

  function completeRoute() {
    if (phase.phase !== 'roadview') return
    const { from, to, route } = phase
    setPhase({ phase: 'arrival', from, to, durationMin: route.duration_min })
  }

  function reset() {
    setPhase({ phase: 'pick-from' })
  }

  function goBack() {
    if (phase.phase === 'pick-to')  setPhase({ phase: 'pick-from' })
    if (phase.phase === 'roadview') setPhase({ phase: 'pick-to', from: phase.from })
  }

  return { stations, phase, loading, selectFrom, selectTo, directTo, completeRoute, reset, goBack }
}
