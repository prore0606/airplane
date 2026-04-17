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
      {/* Naver Maps SDK가 position을 재설정해도 width/height는 유지되도록 인라인 스타일 명시 */}
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />

      <MapCategoryChips
        selected={selectedCategory}
        onSelect={(cat, shouldShow) => { onCategoryChange(cat); setShowList(shouldShow) }}
      />

      {/* 오른쪽 FAB 버튼 */}
      <div className="absolute top-14 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={onLocate}
          disabled={locating}
          className={`w-11 h-11 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40
            ${locating ? '' : 'hover:scale-105 active:scale-95 hover:shadow-xl'}`}
          title="내 위치"
        >
          {locating
            ? <span className="animate-spin text-base">⟳</span>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" fill="currentColor" stroke="none" opacity=".15"/>
              </svg>
          }
        </button>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setShowList(v => !v)}
            className={`w-11 h-11 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 ${
              showList ? 'bg-brand-green text-white shadow-brand-green/40' : 'bg-white text-brand-muted hover:text-brand-green'
            }`}
            title="목록 보기"
          >
            <svg width="17" height="13" viewBox="0 0 17 13" fill="currentColor">
              <rect width="17" height="2" rx="1"/>
              <rect y="5.5" width="13" height="2" rx="1"/>
              <rect y="11" width="9" height="2" rx="1"/>
            </svg>
          </button>
        )}
      </div>

      {/* 토스트 알림 */}
      {locateSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-brand-black/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-brand-green mr-1.5">●</span>내 위치 확인됨
        </div>
      )}
      {locationError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-brand-red text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
          {locationError}
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
