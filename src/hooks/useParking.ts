import { useEffect, useState } from 'react'
import { getParkingStatus, type ParkingLot } from '../services/parkingApi'

export function useParking() {
  const [data, setData] = useState<ParkingLot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getParkingStatus().then((d) => {
      if (!cancelled) { setData(d); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [])

  return { data, loading }
}
