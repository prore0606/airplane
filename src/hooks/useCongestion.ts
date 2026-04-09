import { useEffect, useState } from 'react'
import { getDepartureCongestion, type CongestionInfo } from '../services/congestionApi'

export function useCongestion() {
  const [data, setData] = useState<CongestionInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getDepartureCongestion().then((d) => {
      if (!cancelled) { setData(d); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [])

  return { data, loading }
}
