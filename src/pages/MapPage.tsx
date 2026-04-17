import { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import MapTab from './map/MapTab'
import ParkingTab from './map/ParkingTab'
import { useNaverMap } from '../hooks/useNaverMap'
import { useMapPageState } from '../hooks/useMapPageState'

type TabId = 'map' | 'parking'
type TerminalFilter = 'all' | 'T1' | 'T2'

interface Props { initialCategory?: import('../data/airportFacilities').FacilityCategory | 'all' }

export default function MapPage({ initialCategory = 'all' }: Props) {
  const [activeTab,       setActiveTab]       = useState<TabId>('map')
  const [terminalFilter,  setTerminalFilter]  = useState<TerminalFilter>('all')

  const naverClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID as string | undefined
  const { loaded: mapLoaded, status: mapStatus } = useNaverMap(naverClientId)

  const {
    selectedCategory, setSelectedCategory,
    setSelectedPlace,
    userLocation, locating, locationError, handleLocate,
    places, searchLoading,
    mapClickedPlace, mapSearching, mapNotFound,
    highlightedPlace,
    handleMapClick, handleFacilitySelect, handleCloseClickedPlace,
  } = useMapPageState(initialCategory)

  return (
    <div className="flex flex-col h-full">
      <TopNav />

      <div className="shrink-0 bg-white border-b border-brand-border px-4 pt-4 pb-3">
        <p className="text-xl font-bold text-brand-black">지도 · 주차</p>
        <p className="text-sm text-brand-muted mt-0.5 mb-3">공항 시설과 주차 위치를 한눈에</p>
        <div className="flex bg-brand-surface border border-brand-border rounded-xl p-1 gap-1">
          {([['map', '🗺️ 지도'], ['parking', '🅿️ 주차']] as [TabId, string][]).map(([id, label]) => (
            <button
              key={id as string}
              onClick={() => setActiveTab(id as TabId)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === id ? 'bg-white text-brand-black shadow-sm' : 'text-brand-muted hover:text-brand-ink'
              }`}
            >{label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'map' && (
        <MapTab
          naverClientId={naverClientId}
          terminalFilter={terminalFilter}
          onTerminalChange={(t) => { setTerminalFilter(t); setSelectedPlace(null) }}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => { setSelectedCategory(cat); setSelectedPlace(null) }}
          userLocation={userLocation}
          mapLoaded={mapLoaded}
          mapStatus={mapStatus}
          highlightedPlace={highlightedPlace}
          onMapClick={handleMapClick}
          clickedPlace={mapClickedPlace}
          searchingPlace={mapSearching}
          notFound={mapNotFound}
          onClickedPlaceClose={handleCloseClickedPlace}
          onLocate={handleLocate}
          locating={locating}
          locationError={locationError}
          facilityPlaces={places}
          facilityLoading={searchLoading}
          onFacilitySelect={handleFacilitySelect}
        />
      )}

      {activeTab === 'parking' && <ParkingTab />}
    </div>
  )
}
