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
  const [showList, setShowList] = useState(false)
  const [locateSuccess, setLocateSuccess] = useState(false)

  const { containerRef, clickPinRef, unauthorized } = useMapInstance({
    mapLoaded, userLocation, highlightedPlace, clickedPlace, onMapClick,
  })

  useEffect(() => {
    if (!userLocation) return
    const t1 = setTimeout(() => setLocateSuccess(true), 0)
    const t2 = setTimeout(() => setLocateSuccess(false), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [userLocation])

  if (!mapLoaded) return <MapLoadingState status={mapStatus} />

  if (unauthorized) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center bg-amber-50">
      <p className="text-3xl">🔐</p>
      <p className="font-bold text-amber-800">NCP 도메인 인증 실패</p>
      <div className="bg-white border border-amber-200 rounded-xl p-4 text-left text-sm text-amber-900 space-y-2 max-w-sm">
        <p className="font-semibold">해결 방법:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
          <li>console.ncloud.com 접속</li>
          <li>Maps 애플리케이션 → 수정</li>
          <li>Web 서비스 URL에 추가:</li>
        </ol>
        <code className="block bg-amber-50 border border-amber-200 rounded px-3 py-2 text-xs font-mono mt-1">
          http://localhost:5173
        </code>
      </div>
    </div>
  )

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
