import { useState, useEffect } from 'react'
import { searchAirportFacilities } from '../../services/kakaoLocalService'
import type { KakaoPlace } from '../../services/kakaoLocalService'
import type { FacilityCategory } from '../../data/airportFacilities'
import { useNavigation } from '../../context/NavigationContext'

const TABS: { id: FacilityCategory; icon: string; name: string }[] = [
  { id: 'food',     icon: '🍽️', name: '식당'  },
  { id: 'dutyfree', icon: '🛍️', name: '면세점' },
  { id: 'lounge',   icon: '🛋️', name: '라운지' },
  { id: 'exchange', icon: '💱', name: '환전'  },
  { id: 'atm',      icon: '🏧', name: 'ATM'  },
  { id: 'pharmacy', icon: '💊', name: '약국'  },
]

/* ── 가게 상세 바텀시트 ── */
function PlaceDetailSheet({
  place, icon, onClose, onGoMap,
}: { place: KakaoPlace; icon: string; onClose: () => void; onGoMap: () => void }) {
  const category = place.category_name.split(' > ').pop() ?? place.category_name
  const address  = place.road_address_name || place.address_name

  return (
    /* 배경 딤 */
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* 시트 */}
      <div
        className="relative bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-250"
        onClick={e => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-pale flex items-center justify-center text-3xl shrink-0 shadow-sm">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[18px] text-brand-black leading-snug">{place.place_name}</p>
            <span className="inline-block mt-1 bg-brand-pale text-brand-green text-[11px] font-bold px-2 py-0.5 rounded-full">
              {category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors shrink-0"
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#8A9E92" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="h-px bg-brand-surface mx-5" />

        {/* 정보 */}
        <div className="px-5 py-4 space-y-3">
          {address && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center shrink-0 text-base">📍</div>
              <p className="text-[13px] text-brand-body leading-relaxed pt-1">{address}</p>
            </div>
          )}
          {place.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center shrink-0 text-base">📞</div>
              <p className="text-[13px] text-brand-body">{place.phone}</p>
            </div>
          )}
          {place.distance && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-surface flex items-center justify-center shrink-0 text-base">🚶</div>
              <p className="text-[13px] text-brand-body">
                약 <span className="font-bold text-brand-black">
                  {Number(place.distance) >= 1000
                    ? `${(Number(place.distance) / 1000).toFixed(1)}km`
                    : `${place.distance}m`}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 px-5 pb-10 pt-1">
          <button
            onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(place.place_name)}`, '_blank', 'noopener,noreferrer')}
            className="flex-1 bg-brand-green text-white font-bold py-3.5 rounded-2xl text-[14px] hover:bg-brand-dark transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-brand-green/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
            </svg>
            네이버 지도에서 보기
          </button>
          {place.phone ? (
            <button
              onClick={() => { window.location.href = `tel:${place.phone}` }}
              className="px-4 py-3.5 border border-brand-border rounded-2xl text-[14px] font-semibold text-brand-ink hover:border-brand-green hover:text-brand-green hover:bg-brand-pale transition-all active:scale-[0.98]"
            >
              전화
            </button>
          ) : (
            <button
              onClick={onGoMap}
              className="px-4 py-3.5 border border-brand-border rounded-2xl text-[14px] font-semibold text-brand-ink hover:border-brand-green hover:text-brand-green hover:bg-brand-pale transition-all active:scale-[0.98]"
            >
              지도보기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── 스켈레톤 ── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3.5 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-brand-surface shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-brand-surface rounded-lg w-3/5" />
        <div className="h-3 bg-brand-surface rounded-lg w-2/5" />
      </div>
    </div>
  )
}

/* ── 가게 행 ── */
function PlaceRow({ place, icon, onPress }: { place: KakaoPlace; icon: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 bg-white rounded-2xl p-3.5 text-left hover:bg-brand-pale active:scale-[0.98] transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-pale flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14px] text-brand-black truncate">{place.place_name}</p>
        <p className="text-[12px] text-brand-muted truncate mt-0.5">
          {place.phone || place.road_address_name || place.address_name}
        </p>
      </div>
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="shrink-0 text-brand-border">
        <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

/* ── 메인 섹션 ── */
export default function HomeFacilitySection() {
  const { goToMap } = useNavigation()
  const [selected,     setSelected]     = useState<FacilityCategory>('food')
  const [places,       setPlaces]       = useState<KakaoPlace[]>([])
  const [loading,      setLoading]      = useState(true)
  const [detailPlace,  setDetailPlace]  = useState<KakaoPlace | null>(null)

  useEffect(() => {
    setLoading(true)
    setPlaces([])
    searchAirportFacilities(selected)
      .then(data => setPlaces(data.slice(0, 5)))
      .finally(() => setLoading(false))
  }, [selected])

  const currentTab = TABS.find(t => t.id === selected)!

  return (
    <>
      <div>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-brand-black">공항 내 시설</p>
          <button
            onClick={() => goToMap(selected)}
            className="text-[13px] text-brand-green font-semibold hover:text-brand-dark transition-colors flex items-center gap-0.5"
          >
            지도에서 보기
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-1.5 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelected(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all duration-150 ${
                selected === tab.id
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-white border border-brand-border text-brand-muted hover:border-brand-green hover:text-brand-green'
              }`}
            >
              <span className="text-[13px] leading-none">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* 장소 목록 */}
        <div className="space-y-2">
          {loading && [1, 2, 3].map(i => <SkeletonRow key={i} />)}

          {!loading && places.length === 0 && (
            <div className="bg-white rounded-2xl py-8 flex flex-col items-center gap-2">
              <span className="text-3xl">{currentTab.icon}</span>
              <p className="text-[13px] text-brand-muted">주변 {currentTab.name} 정보를 찾을 수 없어요</p>
            </div>
          )}

          {!loading && places.map(place => (
            <PlaceRow
              key={place.id}
              place={place}
              icon={currentTab.icon}
              onPress={() => setDetailPlace(place)}
            />
          ))}

          {!loading && places.length > 0 && (
            <button
              onClick={() => goToMap(selected)}
              className="w-full py-3 rounded-2xl border border-brand-border text-[13px] font-bold text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors bg-white"
            >
              {currentTab.name} 전체 보기 ›
            </button>
          )}
        </div>
      </div>

      {/* 상세 바텀시트 */}
      {detailPlace && (
        <PlaceDetailSheet
          place={detailPlace}
          icon={currentTab.icon}
          onClose={() => setDetailPlace(null)}
          onGoMap={() => { setDetailPlace(null); goToMap(selected) }}
        />
      )}
    </>
  )
}
