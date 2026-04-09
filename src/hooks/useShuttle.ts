import { useEffect, useState } from 'react'
import { getShuttleBusInfo, type ShuttleBus } from '../services/shuttleApi'

export function useShuttle() {
  const [data, setData] = useState<ShuttleBus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getShuttleBusInfo().then((d) => {
      if (!cancelled) { setData(d); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [])

  return { data, loading }
}
