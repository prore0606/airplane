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

function PlaceRow({ place, icon, onPress }: { place: KakaoPlace; icon: string; onPress: () => void }) {
  const sub = place.road_address_name || place.address_name || ''
  const phone = place.phone

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
          {phone ? phone : sub}
        </p>
      </div>
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="shrink-0 text-brand-border">
        <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

export default function HomeFacilitySection() {
  const { goToMap } = useNavigation()
  const [selected, setSelected] = useState<FacilityCategory>('food')
  const [places,   setPlaces]   = useState<KakaoPlace[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    setPlaces([])
    searchAirportFacilities(selected)
      .then(data => setPlaces(data.slice(0, 5)))
      .finally(() => setLoading(false))
  }, [selected])

  const currentTab = TABS.find(t => t.id === selected)!

  return (
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
            onPress={() => goToMap(selected)}
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
  )
}
