import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { getDepartureFlights, type Flight } from '../services/flightApi'

interface FlightContextValue {
  flights: Flight[]
  loading: boolean
  lastUpdated: Date | null
  refetch: () => void
}

const FlightContext = createContext<FlightContextValue | null>(null)

export function FlightProvider({ children }: { children: React.ReactNode }) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refetch = useCallback(() => {
    let cancelled = false
    setLoading(true)
    getDepartureFlights()
      .then((data) => {
        if (!cancelled) {
          setFlights(data)
          setLoading(false)
          setLastUpdated(new Date())
        }
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    return refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FlightContext.Provider value={{ flights, loading, lastUpdated, refetch }}>
      {children}
    </FlightContext.Provider>
  )
}

export function useFlightContext() {
  const ctx = useContext(FlightContext)
  if (!ctx) throw new Error('useFlightContext must be used within FlightProvider')
  return ctx
}
