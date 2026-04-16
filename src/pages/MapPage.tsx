import { useState, useCallback, useEffect } from 'react'
import TopNav from '../components/layout/TopNav'
import AirportMap from '../components/map/AirportMap'
import type { HighlightedPlace } from '../components/map/AirportMap'
import FacilityDetailModal from '../components/map/FacilityDetailModal'
import MapPlaceCard from '../components/map/MapPlaceCard'
import ParkingNavigationModal from '../components/map/ParkingNavigationModal'
import { useKakaoMap } from '../hooks/useKakaoMap'
import { useParking } from '../hooks/useParking'
import { parkingStatus } from '../services/parkingApi'
import type { ParkingLot } from '../services/parkingApi'
import { searchAirportFacilities, searchNearbyPlace } from '../services/kakaoLocalService'
import type { KakaoPlace } from '../services/kakaoLocalService'
import type { FacilityCategory } from '../data/airportFacilities'

// ── Types ────────────────────────────────────────────────────────────────────

type TabId = 'map' | 'parking'
type TerminalFilter = 'all' | 'T1' | 'T2'

interface ParkingSpot {
  zone: string
  floor: string
  savedAt: string
}

// ── Main component ───────────────────────────────────────────────────────────

export default function MapPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<TabId>('map')

  // Map state
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | 'all'>('all')
  const [terminalFilter, setTerminalFilter] = useState<TerminalFilter>('all')
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Kakao local search
  const [places, setPlaces] = useState<KakaoPlace[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // 카테고리 변경 시 카카오 로컬 검색
  useEffect(() => {
    if (selectedCategory === 'all') { setPlaces([]); return }
    setSearchLoading(true)
    searchAirportFacilities(selectedCategory)
      .then(setPlaces)
      .finally(() => setSearchLoading(false))
  }, [selectedCategory])

  // Parking state
  const [parking, setParking] = useState<ParkingSpot | null>(null)
  const [navLot, setNavLot] = useState<ParkingLot | null>(null)
  const [saving, setSaving] = useState(false)
  const { data: parkingLots, loading: parkingLoading } = useParking()

  // Kakao Maps SDK
  const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined
  const { loaded: mapLoaded, status: mapStatus } = useKakaoMap(kakaoAppKey)

  // 지도에 하이라이트할 장소
  const highlightedPlace: HighlightedPlace | null = selectedPlace
    ? { lat: parseFloat(selectedPlace.y), lng: parseFloat(selectedPlace.x), name: selectedPlace.place_name }
    : null

  // 지도 클릭 → 주변 장소 검색
  const [mapClickedPlace, setMapClickedPlace] = useState<KakaoPlace | null>(null)
  const [mapSearching, setMapSearching] = useState(false)
  const [mapNotFound, setMapNotFound] = useState(false)

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setMapSearching(true)
    setMapNotFound(false)
    // clickedPlace는 null로 초기화하지 않음 → "핀 제거" effect가 즉시 실행되는 것 방지
    const found = await searchNearbyPlace(lat, lng)
    setMapSearching(false)
    if (found) {
      setMapClickedPlace(found)
    } else {
      setMapClickedPlace(null)
      setMapNotFound(true)
    }
  }, [])

  const handleFacilitySelect = useCallback((place: KakaoPlace) => {
    setSelectedPlace(place)
  }, [])

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError('위치 접근이 거부되었습니다.')
        setLocating(false)
      },
      { timeout: 10000, maximumAge: 30000 }
    )
  }

  function handleSaveParking() {
    setSaving(true)
    setTimeout(() => {
      setParking({ zone: 'A구역', floor: '3층', savedAt: '오후 2:34' })
      setSaving(false)
    }, 1200)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
    <div className="flex flex-col h-full">
      <TopNav />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

          {/* Page header */}
          <div>
            <p className="text-xl font-bold text-brand-black">지도 · 주차</p>
            <p className="text-sm text-brand-muted mt-1">공항 시설과 주차 위치를 한눈에</p>
          </div>

          {/* Tab selector */}
          <div className="flex bg-brand-surface border border-brand-border rounded-xl p-1 gap-1">
            {([['map', '🗺️ 지도'], ['parking', '🅿️ 주차']] as [TabId, string][]).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-white text-brand-black shadow-sm'
                    : 'text-brand-muted hover:text-brand-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── 지도 탭 ─────────────────────────────────────────────── */}
          {activeTab === 'map' && (
            <div className="space-y-4">

              {/* API key warning */}
              {!kakaoAppKey && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <p className="font-bold text-amber-800">🗺️ 카카오맵 API 키 설정 필요</p>
                  <p className="text-amber-700 mt-1">
                    .env.local에 VITE_KAKAO_MAP_KEY=발급받은키 를 추가하세요
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    developers.kakao.com → 앱 생성 → JavaScript 키
                  </p>
                </div>
              )}

              {/* 터미널 선택 */}
              <div className="flex gap-2">
                {([['all', '전체'], ['T1', 'T1'], ['T2', 'T2']] as [TerminalFilter, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => { setTerminalFilter(id); setSelectedPlace(null) }}
                    className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors border ${
                      terminalFilter === id
                        ? 'bg-brand-green text-white border-brand-green'
                        : 'bg-white border-brand-border text-brand-muted hover:border-brand-green hover:text-brand-green'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 지도 (카테고리 칩 포함) */}
              <AirportMap
                selectedCategory={selectedCategory}
                userLocation={userLocation}
                onCategoryChange={(cat) => { setSelectedCategory(cat); setSelectedPlace(null) }}
                mapLoaded={mapLoaded}
                mapStatus={mapStatus}
                highlightedPlace={highlightedPlace}
                onMapClick={handleMapClick}
                clickedPlace={mapClickedPlace}
                searchingPlace={mapSearching}
                notFound={mapNotFound}
                onClickedPlaceClose={() => { setMapClickedPlace(null); setMapNotFound(false) }}
              />

              {/* 미리보기 지도 아래 장소 카드 */}
              {mapSearching && (
                <div className="bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-brand-surface shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-brand-surface rounded w-1/2" />
                    <div className="h-2 bg-brand-surface rounded w-1/3" />
                  </div>
                </div>
              )}
              {!mapSearching && mapClickedPlace && (
                <MapPlaceCard
                  place={mapClickedPlace}
                  onClose={() => { setMapClickedPlace(null); setMapNotFound(false) }}
                />
              )}
              {!mapSearching && mapNotFound && (
                <div className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-brand-muted">📍 근처에 등록된 장소가 없어요</p>
                  <button
                    onClick={() => setMapNotFound(false)}
                    className="text-xs text-brand-muted hover:text-brand-ink"
                  >✕</button>
                </div>
              )}

              {/* My location button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLocate}
                  disabled={locating}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-xl text-sm font-semibold text-brand-ink hover:border-brand-green transition-colors disabled:opacity-60"
                >
                  {locating ? (
                    <span className="animate-spin text-base">⏳</span>
                  ) : (
                    <span className="text-base">📍</span>
                  )}
                  {locating ? '위치 확인 중...' : '내 위치 표시'}
                </button>
                {userLocation && !locating && (
                  <span className="text-xs text-brand-green font-semibold">위치 확인됨</span>
                )}
                {locationError && (
                  <span className="text-xs text-brand-red">{locationError}</span>
                )}
              </div>

              {/* 시설 검색 결과 */}
              {selectedCategory !== 'all' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">검색 결과</p>
                    {!searchLoading && <span className="text-xs text-brand-muted">{places.length}개</span>}
                  </div>

                  {searchLoading ? (
                    <div className="space-y-2">
                      {[1,2,3].map((i) => (
                        <div key={i} className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3 animate-pulse">
                          <div className="w-10 h-10 rounded-xl bg-brand-surface shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-brand-surface rounded w-2/3" />
                            <div className="h-2 bg-brand-surface rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : places.length === 0 ? (
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 text-center">
                      <p className="text-brand-muted text-sm">검색 결과가 없습니다</p>
                    </div>
                  ) : (
                    places.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handleFacilitySelect(place)}
                        className="w-full text-left bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3 transition-colors hover:border-brand-green active:bg-brand-pale"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-xl shrink-0">
                          {selectedCategory === 'food' ? '🍽️'
                            : selectedCategory === 'dutyfree' ? '🛍️'
                            : selectedCategory === 'lounge' ? '🛋️'
                            : selectedCategory === 'atm' ? '💳'
                            : selectedCategory === 'exchange' ? '💱'
                            : selectedCategory === 'pharmacy' ? '💊'
                            : '🏬'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-black text-sm truncate">{place.place_name}</p>
                          <p className="text-xs text-brand-muted truncate">
                            {place.road_address_name || place.address_name}
                          </p>
                          {place.phone && (
                            <p className="text-xs text-brand-muted">{place.phone}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {place.distance && (
                            <p className="text-xs text-brand-green font-bold">
                              {Number(place.distance) >= 1000
                                ? `${(Number(place.distance)/1000).toFixed(1)}km`
                                : `${place.distance}m`}
                            </p>
                          )}
                          <p className="text-[10px] text-brand-muted mt-0.5">지도 보기 →</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedCategory === 'all' && (
                <div className="bg-brand-surface border border-brand-border rounded-xl p-6 text-center">
                  <p className="text-2xl mb-2">☝️</p>
                  <p className="text-sm font-semibold text-brand-ink">위에서 카테고리를 선택하면</p>
                  <p className="text-xs text-brand-muted mt-1">카카오 지도 기반 실제 시설 목록이 나옵니다</p>
                </div>
              )}
            </div>
          )}

          {/* ── 주차 탭 ─────────────────────────────────────────────── */}
          {activeTab === 'parking' && (
            <div className="space-y-4">

              {/* 주차 저장 카드 */}
              {!parking ? (
                <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4">
                  <div>
                    <p className="font-bold text-brand-black mb-1">차 위치 저장</p>
                    <p className="text-sm text-brand-muted">공항 도착 후 주차하면 GPS로 위치를 저장하세요</p>
                  </div>
                  <button
                    onClick={handleSaveParking}
                    disabled={saving}
                    className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
                  >
                    {saving ? '📍 저장 중...' : '📍 현재 위치로 주차 저장'}
                  </button>
                  <div className="space-y-2">
                    <p className="text-xs text-brand-muted font-semibold">직접 입력</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['A구역', 'B구역', 'C구역', 'D구역'].map((z) => (
                        <button
                          key={z}
                          onClick={() => setParking({ zone: z, floor: '1층', savedAt: '지금' })}
                          className="border border-brand-border rounded-xl py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-green transition-colors"
                        >
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-brand-green rounded-xl overflow-hidden">
                  <div className="bg-brand-green px-5 py-3 flex items-center justify-between">
                    <span className="font-bold text-white text-sm">주차 위치 저장됨</span>
                    <span className="text-[10px] text-white/70">{parking.savedAt} 저장</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-muted">구역</span>
                      <span className="font-bold text-brand-black">{parking.zone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-muted">층</span>
                      <span className="font-bold text-brand-black">{parking.floor}</span>
                    </div>
                    <div className="border-t border-brand-border pt-3 space-y-2">
                      <button className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors text-sm">
                        📍 차 위치로 안내
                      </button>
                      <button
                        onClick={() => setParking(null)}
                        className="w-full border border-brand-border text-brand-muted font-semibold py-2.5 rounded-xl hover:border-brand-red hover:text-brand-red transition-colors text-sm"
                      >
                        위치 초기화
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 실시간 주차 현황 */}
              <div className="bg-white border border-brand-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">실시간 주차 현황</p>
                  {!parkingLoading && (
                    <span className="text-[10px] text-brand-green font-semibold bg-brand-pale px-2 py-0.5 rounded-pill">● LIVE</span>
                  )}
                </div>
                {parkingLoading ? (
                  <p className="text-sm text-brand-muted animate-pulse">로딩 중...</p>
                ) : (
                  <div className="space-y-2">
                    {parkingLots.map((lot) => {
                      const { label, color, pct } = parkingStatus(lot.parking, lot.parkingarea)
                      const avail = Math.max(0, Number(lot.parkingarea) - Number(lot.parking))
                      const isAvailable = pct < 95
                      return (
                        <button
                          key={lot.floor}
                          onClick={() => isAvailable && setNavLot(lot)}
                          disabled={!isAvailable}
                          className={`w-full text-left transition-all rounded-xl p-2 -mx-2 ${
                            isAvailable
                              ? 'hover:bg-brand-pale active:bg-brand-pale cursor-pointer'
                              : 'cursor-default opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-brand-ink">{lot.floor}</span>
                              {isAvailable && (
                                <span className="text-[10px] text-brand-green font-bold bg-brand-pale px-1.5 py-0.5 rounded-full">
                                  길안내 →
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold ${color}`}>{label}</span>
                              <span className="text-[10px] text-brand-muted">{avail}면 여유</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden">
                            <div
                              className={`h-full rounded-pill transition-all ${
                                pct >= 90 ? 'bg-brand-red' : pct >= 70 ? 'bg-brand-orange' : 'bg-brand-green'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 주차 요금 안내 */}
              <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">인천공항 주차 요금</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: '단기 주차장', rate: '1,800원 / 30분' },
                    { label: '장기 주차장', rate: '1,200원 / 1시간' },
                    { label: '화물청사',   rate: '1,000원 / 1시간' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-brand-muted">{r.label}</span>
                      <span className="font-semibold text-brand-ink">{r.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>

    {selectedPlace && (
      <FacilityDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    )}

    {navLot && (
      <ParkingNavigationModal
        lot={navLot}
        onClose={() => setNavLot(null)}
      />
    )}
    </>
  )
}
