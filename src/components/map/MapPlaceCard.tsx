import type { KakaoPlace } from '../../services/kakaoLocalService'

interface Props {
  place: KakaoPlace
  loading?: boolean
  onClose: () => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  '음식점': '🍽️', '카페': '☕', '면세점': '🛍️', '라운지': '🛋️',
  '은행': '💳', '환전': '💱', '약국': '💊', '편의점': '🏪',
  '베이커리': '🥐', '패스트푸드': '🍔', '쇼핑': '🏬',
}

function getEmoji(categoryName: string) {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (categoryName.includes(key)) return emoji
  }
  return '📍'
}

export default function MapPlaceCard({ place, onClose }: Props) {
  const category = place.category_name.split(' > ').pop() ?? place.category_name
  const emoji = getEmoji(place.category_name)

  const distanceText = place.distance
    ? Number(place.distance) >= 1000
      ? `${(Number(place.distance) / 1000).toFixed(1)}km`
      : `${place.distance}m`
    : null

  function openNaver() {
    const query = encodeURIComponent(place.place_name)
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white border border-brand-green rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-pale flex items-center justify-center text-xl shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-brand-black text-[15px] truncate">{place.place_name}</p>
          <p className="text-xs text-brand-green font-semibold">{category}</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 정보 */}
      <div className="px-4 pb-3 space-y-1.5">
        {(place.road_address_name || place.address_name) && (
          <div className="flex items-start gap-2">
            <span className="text-sm shrink-0 mt-0.5">📍</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              {place.road_address_name || place.address_name}
            </p>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2">
            <span className="text-sm shrink-0">📞</span>
            <p className="text-xs text-gray-600">{place.phone}</p>
          </div>
        )}
        {distanceText && (
          <div className="flex items-center gap-2">
            <span className="text-sm shrink-0">🚶</span>
            <p className="text-xs text-gray-600">
              현 위치에서 약 <span className="font-bold text-gray-800">{distanceText}</span>
            </p>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={openNaver}
          className="flex-1 bg-brand-green text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-dark transition-colors active:scale-[0.98]"
        >
          자세히 보기 →
        </button>
        {place.phone && (
          <button
            onClick={() => { window.location.href = `tel:${place.phone}` }}
            className="px-4 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-ink hover:border-brand-green transition-colors active:scale-[0.98]"
          >
            📞
          </button>
        )}
      </div>
    </div>
  )
}
