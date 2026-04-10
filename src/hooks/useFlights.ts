import { useApiData } from './useApiData'
import { getDepartureFlights, type Flight } from '../services/flightApi'

export const useFlights = () => useApiData<Flight>(getDepartureFlights)
