import { useApiData } from './useApiData'
import { getDepartureCongestion, type CongestionInfo } from '../services/congestionApi'

export const useCongestion = () => useApiData<CongestionInfo>(getDepartureCongestion)
