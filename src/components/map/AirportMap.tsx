import { useState, useEffect } from 'react'
import type { NaverMapStatus } from '../../hooks/useNaverMap'
import type { KakaoPlace } from '../../services/kakaoLocalService'
import type { FacilityCategory } from '../../data/airportFacilities'
import type { HighlightedPlace } from './mapHelpers'
import { useMapInstance } from '../../hooks/useMapInstance'
import { CATEGORY_META } from './MapCategoryChips'
import MapLoadingState from './MapLoadingState'
import MapCategoryChips from './MapCategoryChips'
import MapFacilitySheet from './MapFacilitySheet'
import MapOverlays from './MapOverlays'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type { HighlightedPlace }

export interface AirportMapProps {
  selectedCategory: FacilityCategory | 'all'
  onCategoryChange: (cat: FacilityCategory | 'all') => void
  userLocation: { lat: number; lng: number } | null
  mapLoaded: boolean
  mapStatus: NaverMapStatus
  highlightedPlace?: HighlightedPlace | null
  onMapClick?: (lat: number, lng: number) => void
  clickedPlace?: KakaoPlace | null
  searchingPlace?: boolean
  notFound?: boolean
  onClickedPlaceClose?: () => void
  onLocate?: () => void
  locating?: boolean
  locationError?: string | null
  facilityPlaces?: KakaoPlace[]
  facilityLoading?: boolean
  onFacilitySelect?: (place: KakaoPlace) => void
}

export default function AirportMap({
  selectedCategory, onCategoryChange,
  userLocation, mapLoaded, mapStatus,
  highlightedPlace, onMapClick,
  clickedPlace, searchingPlace = false, notFound = false, onClickedPlaceClose,
  onLocate, locating, locationError,
  facilityPlaces = [], facilityLoading, onFacilitySelect,
}: AirportMapProps) {
  const [showList,      setShowList]      = useState(false)
  const [locateSuccess, setLocateSuccess] = useState(false)

  const { containerRef, clickPinRef } = useMapInstance({
    mapLoaded, userLocation, highlightedPlace, clickedPlace, onMapClick,
  })

  useEffect(() => {
    if (!userLocation) return
    const t1 = setTimeout(() => setLocateSuccess(true), 0)
    const t2 = setTimeout(() => setLocateSuccess(false), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [userLocation])

  // auth_error 포함 비준비 상태 → 로딩/에러 화면
  if (!mapLoaded) return <MapLoadingState status={mapStatus} />

  const categoryLabel = CATEGORY_META.find(c => c.id === selectedCategory)?.label ?? ''

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      <MapCategoryChips
        selected={selectedCategory}
        onSelect={(cat, shouldShow) => { onCategoryChange(cat); setShowList(shouldShow) }}
      />

      <div className="absolute top-14 right-3 z-10 flex flex-col gap-2">
        <button onClick={onLocate} disabled={locating}
          className="w-11 h-11 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center text-lg hover:border-brand-green transition-colors disabled:opacity-50"
        >{locating ? '⏳' : '📍'}</button>

        {selectedCategory !== 'all' && (
          <button onClick={() => setShowList(v => !v)}
            className={`w-11 h-11 rounded-xl shadow-lg border flex items-center justify-center text-lg transition-colors ${showList ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 hover:border-brand-green'}`}
          >☰</button>
        )}
      </div>

      {locateSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap animate-in fade-in duration-200">
          📍 내 위치 확인됨
        </div>
      )}
      {locationError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
          ⚠️ {locationError}
        </div>
      )}

      <MapOverlays
        searching={searchingPlace}
        clickedPlace={clickedPlace ?? null}
        notFound={notFound}
        onClose={onClickedPlaceClose ?? (() => {})}
      />

      {showList && selectedCategory !== 'all' && (
        <MapFacilitySheet
          categoryLabel={categoryLabel}
          places={facilityPlaces}
          loading={facilityLoading ?? false}
          onClose={() => setShowList(false)}
          onSelect={(place) => {
            const pin = (clickPinRef as any).current
            if (pin) { pin.setMap(null); (clickPinRef as any).current = null }
            onFacilitySelect?.(place)
            setShowList(false)
          }}
        />
      )}
    </div>
  )
}
