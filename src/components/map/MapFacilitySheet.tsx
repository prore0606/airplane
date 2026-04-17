import type { KakaoPlace } from '../../services/kakaoLocalService'
import { getEmoji } from './MapPlaceCard'

interface Props {
  categoryLabel: string
  places: KakaoPlace[]
  loading: boolean
  onClose: () => void
  onSelect: (place: KakaoPlace) => void
}

function DistanceBadge({ distance }: { distance: string }) {
  const n = Number(distance)
  const text = n >= 1000 ? `${(n / 1000).toFixed(1)}km` : `${distance}m`
  return (
    <span className="text-[11px] text-brand-green font-bold bg-brand-pale px-2 py-0.5 rounded-full shrink-0">
      {text}
    </span>
  )
}

export default function MapFacilitySheet({ categoryLabel, places, loading, onClose, onSelect }: Props) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-250"
      style={{ maxHeight: '62%' }}
    >
      {/* 헤더 */}
      <div className="shrink-0 px-5 pt-3 pb-0">
        <div className="flex justify-center mb-3">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-brand-surface">
          <div>
            <p className="font-black text-brand-black text-[15px]">{categoryLabel}</p>
            {!loading && places.length > 0 && (
              <p className="text-[11px] text-brand-muted mt-0.5">{places.length}개 장소</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#8A9E92" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div className="overflow-y-auto flex-1 px-2 py-2">
        {loading && (
          <div className="space-y-1 p-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-brand-surface shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-brand-surface rounded-lg w-2/3" />
                  <div className="h-3 bg-brand-surface rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && places.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-brand-muted font-medium">주변에 {categoryLabel}이 없어요</p>
          </div>
        )}
        {!loading && places.map((place) => (
          <button
            key={place.id}
            onClick={() => onSelect(place)}
            className="w-full text-left px-3 py-3 rounded-2xl flex items-center gap-3 hover:bg-brand-surface active:bg-brand-pale transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-pale flex items-center justify-center text-xl shrink-0">
              {getEmoji(place.category_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[14px] text-brand-black truncate">{place.place_name}</p>
              <p className="text-[12px] text-brand-muted truncate mt-0.5">
                {place.road_address_name || place.address_name}
              </p>
            </div>
            {place.distance && <DistanceBadge distance={place.distance} />}
          </button>
        ))}
      </div>
    </div>
  )
}
