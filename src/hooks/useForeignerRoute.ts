import { useState, useEffect } from 'react'
import { getStations, getRoute, getRouteSteps, STATIONS } from '../services/foreignerRouteService'
import type { Station, RoutePhase } from '../types/foreigner'

export function useForeignerRoute() {
  const [stations, setStations]   = useState<Station[]>([])
  const [phase, setPhase]         = useState<RoutePhase>({ phase: 'pick-from' })
  const [loading, setLoading]     = useState(false)

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
      if (!route) return
      const steps = await getRouteSteps(route.id)
      setPhase({ phase: 'roadview', from, to, route, steps })
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
    if (phase.phase === 'pick-to') setPhase({ phase: 'pick-from' })
    if (phase.phase === 'roadview') setPhase({ phase: 'pick-to', from: phase.from })
  }

  async function directTo(toStationCode: string) {
    const from = STATIONS.find(s => s.code === 'ICN_T1')
    const to   = STATIONS.find(s => s.code === toStationCode)
    if (!from || !to) return
    setLoading(true)
    try {
      const route = await getRoute(from.id, to.id)
      if (!route) { setPhase({ phase: 'pick-from' }); return }
      const steps = await getRouteSteps(route.id)
      setPhase({ phase: 'roadview', from, to, route, steps })
    } finally {
      setLoading(false)
    }
  }

  return { stations, phase, loading, selectFrom, selectTo, completeRoute, reset, goBack, directTo }
}
