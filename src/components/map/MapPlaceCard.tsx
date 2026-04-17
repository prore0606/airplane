import type { KakaoPlace } from '../../services/kakaoLocalService'

interface Props {
  place: KakaoPlace
  onClose: () => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  '음식점': '🍽️', '카페': '☕', '면세점': '🛍️', '라운지': '🛋️',
  '은행': '💳', '환전': '💱', '약국': '💊', '편의점': '🏪',
  '베이커리': '🥐', '패스트푸드': '🍔', '쇼핑': '🏬', '병원': '🏥',
}

export function getEmoji(categoryName: string) {
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

  function openNaverMaps() {
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(place.place_name)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-250">
      {/* 드래그 핸들 */}
      <div className="flex justify-center pt-3 pb-0.5">
        <div className="w-9 h-1 bg-gray-200 rounded-full" />
      </div>

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-pale flex items-center justify-center text-2xl shrink-0 shadow-sm">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-brand-black text-[17px] leading-snug truncate">{place.place_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block bg-brand-pale text-brand-green text-[11px] font-bold px-2 py-0.5 rounded-full">{category}</span>
            {distanceText && (
              <span className="text-[11px] text-brand-muted font-semibold">• {distanceText}</span>
            )}
          </div>
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

      {/* 구분선 */}
      <div className="h-px bg-brand-surface mx-5" />

      {/* 상세 정보 */}
      <div className="px-5 py-3.5 space-y-2">
        {(place.road_address_name || place.address_name) && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-surface flex items-center justify-center shrink-0 mt-0.5 text-sm">📍</div>
            <p className="text-[13px] text-brand-body leading-relaxed pt-1">
              {place.road_address_name || place.address_name}
            </p>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-surface flex items-center justify-center shrink-0 text-sm">📞</div>
            <p className="text-[13px] text-brand-body">{place.phone}</p>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 px-5 pb-8 pt-2">
        <button
          onClick={openNaverMaps}
          className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl text-[14px] hover:bg-brand-dark transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-brand-green/25"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
          </svg>
          네이버 지도로 보기
        </button>
        {place.phone && (
          <button
            onClick={() => { window.location.href = `tel:${place.phone}` }}
            className="px-4 py-3 border border-brand-border rounded-2xl text-[14px] font-semibold text-brand-ink hover:border-brand-green hover:text-brand-green hover:bg-brand-pale transition-all active:scale-[0.98]"
          >
            전화
          </button>
        )}
      </div>
    </div>
  )
}
