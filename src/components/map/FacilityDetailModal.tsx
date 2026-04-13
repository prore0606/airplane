import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { KakaoPlace } from '../../services/kakaoLocalService'

interface Props {
  place: KakaoPlace
  onClose: () => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  '음식점': '🍽️', '카페': '☕', '면세점': '🛍️', '라운지': '🛋️',
  '은행': '💳', '환전': '💱', '약국': '💊', '쇼핑': '🏬',
  '편의점': '🏪', '베이커리': '🥐', '패스트푸드': '🍔',
}

function getEmoji(categoryName: string) {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (categoryName.includes(key)) return emoji
  }
  return '📍'
}

export default function FacilityDetailModal({ place, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const category = place.category_name.split(' > ').pop() ?? place.category_name
  const emoji = getEmoji(place.category_name)

  // 미니 지도 렌더링
  useEffect(() => {
    if (!mapRef.current) return
    const kakao = (window as any).kakao
    if (!kakao?.maps) return

    const lat = parseFloat(place.y)
    const lng = parseFloat(place.x)
    const center = new kakao.maps.LatLng(lat, lng)

    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 3,
      draggable: false,
      scrollwheel: false,
    })

    // 마커
    const marker = new kakao.maps.Marker({ position: center })
    marker.setMap(map)

    // 인포윈도우
    const info = new kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;font-weight:bold;white-space:nowrap">${place.place_name}</div>`,
    })
    info.open(map, marker)
  }, [place])

  function handleCall() {
    if (place.phone) window.location.href = `tel:${place.phone}`
  }

  function handleOpenNaver() {
    const query = encodeURIComponent(place.place_name)
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank', 'noopener,noreferrer')
  }

  function handleOpenKakao() {
    window.open(place.place_url, '_blank', 'noopener,noreferrer')
  }

  const distanceText = place.distance
    ? Number(place.distance) >= 1000
      ? `${(Number(place.distance) / 1000).toFixed(1)}km`
      : `${place.distance}m`
    : null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
        {/* 핸들 */}
        <div className="flex justify-center pt-3 shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="overflow-y-auto flex-1">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-pale flex items-center justify-center text-2xl shrink-0">
                {emoji}
              </div>
              <div>
                <p className="font-black text-[17px] text-gray-900 leading-tight">{place.place_name}</p>
                <p className="text-xs text-brand-green font-semibold mt-0.5">{category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 shrink-0 mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 미니 지도 */}
          <div
            ref={mapRef}
            className="w-full mx-0"
            style={{ height: 200 }}
          />

          {/* 정보 */}
          <div className="px-5 py-4 space-y-3">
            {/* 주소 */}
            {(place.road_address_name || place.address_name) && (
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">📍</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {place.road_address_name || place.address_name}
                  </p>
                  {place.road_address_name && place.address_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{place.address_name}</p>
                  )}
                </div>
              </div>
            )}

            {/* 전화 */}
            {place.phone && (
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">📞</span>
                <p className="text-sm font-semibold text-gray-800">{place.phone}</p>
              </div>
            )}

            {/* 거리 */}
            {distanceText && (
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">🚶</span>
                <p className="text-sm text-gray-600">
                  인천공항에서 약 <span className="font-bold text-gray-800">{distanceText}</span>
                </p>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="px-5 pb-8 space-y-2">
            <button
              onClick={handleOpenNaver}
              className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-4 rounded-2xl text-[15px] hover:bg-brand-dark transition-colors active:scale-[0.98]"
            >
              🗺️ 네이버 지도에서 보기
            </button>
            {place.phone && (
              <button
                onClick={handleCall}
                className="w-full flex items-center justify-center gap-2 bg-white border border-brand-border text-brand-ink font-bold py-3.5 rounded-2xl text-sm hover:border-brand-green transition-colors active:scale-[0.98]"
              >
                📞 전화하기
              </button>
            )}
            <button
              onClick={handleOpenKakao}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold py-3 rounded-2xl text-sm hover:bg-yellow-300 transition-colors active:scale-[0.98]"
            >
              🗺️ 카카오맵에서 더 보기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
