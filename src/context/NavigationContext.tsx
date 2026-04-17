import { createContext, useContext } from 'react'
import type { FacilityCategory } from '../data/airportFacilities'

export interface NavigationCtx {
  goToMap: (category?: FacilityCategory | 'all') => void
}

export const NavigationContext = createContext<NavigationCtx>({ goToMap: () => {} })

export const useNavigation = () => useContext(NavigationContext)
