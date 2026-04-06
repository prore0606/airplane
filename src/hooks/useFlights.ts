import { useEffect, useState } from 'react'
import { getDepartureFlights, type Flight } from '../services/flightApi'

interface State {
  flights: Flight[]
  loading: boolean
  error: string | null
}

export function useFlights() {
  const [state, setState] = useState<State>({ flights: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ flights: [], loading: true, error: null })

    getDepartureFlights()
      .then((flights) => {
        if (!cancelled) setState({ flights, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ flights: [], loading: false, error: err.message })
      })

    return () => { cancelled = true }
  }, [])

  return state
}
