import { useApiData } from './useApiData'
import { getShuttleBusInfo, type ShuttleBus } from '../services/shuttleApi'

export const useShuttle = () => useApiData<ShuttleBus>(getShuttleBusInfo)
