import { useApiData } from './useApiData'
import { getParkingStatus, type ParkingLot } from '../services/parkingApi'

export const useParking = () => useApiData<ParkingLot>(getParkingStatus)
