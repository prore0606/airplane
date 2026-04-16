import { createPortal } from 'react-dom'
import type { ParkingLot } from '../../services/parkingApi'
import { lotTerminal, lotType } from '../../services/parkingApi'

interface Props {
  lot: ParkingLot
  onClose: () => void
}

// 주차장별 실제 좌표 및 주소
const PARKING_COORDS: Record<string, { lat: number; lng: number; address: string }> = {
  'T1_단기': { lat: 37.4484, lng: 126.4513, address: '인천광역시 중구 공항로 272 T1 단기주차장' },
  'T1_장기': { lat: 37.4368, lng: 126.4408, address: '인천광역시 중구 공항동로 T1 장기주차장' },
  'T1_예약': { lat: 37.4368, lng: 126.4408, address: '인천광역시 중구 공항동로 T1 예약주차장' },
  'T2_단기': { lat: 37.4697, lng: 126.4426, address: '인천광역시 중구 공항로 272 T2 단기주차장' },
  'T2_장기': { lat: 37.4630, lng: 126.4375, address: '인천광역시 중구 공항동로 T2 장기주차장' },
  'T2_예약': { lat: 37.4630, lng: 126.4375, address: '인천광역시 중구 공항동로 T2 예약주차장' },
}

function getCoords(lot: ParkingLot) {
  const terminal = lotTerminal(lot.floor) ?? 'T1'
  const type = lotType(lot.floor)
  return PARKING_COORDS[`${terminal}_${type}`] ?? PARKING_COORDS['T1_단기']
}

export default function ParkingNavigationModal({ lot, onClose }: Props) {
  const coords = getCoords(lot)
  const name = encodeURIComponent(lot.floor)
  const nameRaw = lot.floor

  function openKakao() {
    // 카카오맵 앱 딥링크 → 실패 시 웹으로 폴백
    const appUrl = `kakaomap://route?ep=${coords.lat},${coords.lng}&by=CAR`
    const webUrl = `https://map.kakao.com/link/to/${name},${coords.lat},${coords.lng}`
    const app = window.open(appUrl)
    setTimeout(() => {
      if (!app || app.closed) window.open(webUrl, '_blank', 'noopener,noreferrer')
    }, 1500)
  }

  function openNaver() {
    const appUrl = `nmap://route/car?dlat=${coords.lat}&dlng=${coords.lng}&dname=${name}&appname=airmate`
    const webUrl = `https://map.naver.com/v5/directions/-/-/-/car?c=${coords.lng},${coords.lat},15,0,0,0,dh`
    const app = window.open(appUrl)
    setTimeout(() => {
      if (!app || app.closed) window.open(webUrl, '_blank', 'noopener,noreferrer')
    }, 1500)
  }

  function openTmap() {
    const appUrl = `tmap://route?goalname=${name}&goalx=${coords.lng}&goaly=${coords.lat}`
    const webUrl = `https://www.tmap.co.kr/tmap2/mobile/route.do?goalname=${name}&goalx=${coords.lng}&goaly=${coords.lat}`
    const app = window.open(appUrl)
    setTimeout(() => {
      if (!app || app.closed) window.open(webUrl, '_blank', 'noopener,noreferrer')
    }, 1500)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pt-4 pb-8 space-y-4">
          {/* 헤더 */}
          <div>
            <p className="font-black text-lg text-gray-900">🅿️ 길안내</p>
            <p className="text-sm text-brand-green font-semibold mt-0.5">{nameRaw}</p>
            <p className="text-xs text-gray-400 mt-1">{coords.address}</p>
          </div>

          {/* 안내 앱 선택 */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">앱 선택</p>

            {/* 카카오맵 */}
            <button
              onClick={openKakao}
              className="w-full flex items-center gap-4 bg-yellow-400 rounded-2xl px-5 py-4 hover:bg-yellow-300 transition-colors active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-300 flex items-center justify-center text-xl shrink-0">
                🗺️
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 text-[15px]">카카오맵</p>
                <p className="text-xs text-gray-700">카카오맵으로 길안내</p>
              </div>
              <span className="ml-auto text-gray-700">→</span>
            </button>

            {/* 네이버 지도 */}
            <button
              onClick={openNaver}
              className="w-full flex items-center gap-4 bg-green-500 rounded-2xl px-5 py-4 hover:bg-green-600 transition-colors active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-green-400 flex items-center justify-center text-xl shrink-0">
                🗺️
              </div>
              <div className="text-left">
                <p className="font-black text-white text-[15px]">네이버 지도</p>
                <p className="text-xs text-green-100">네이버 지도로 길안내</p>
              </div>
              <span className="ml-auto text-white">→</span>
            </button>

            {/* T맵 */}
            <button
              onClick={openTmap}
              className="w-full flex items-center gap-4 bg-blue-500 rounded-2xl px-5 py-4 hover:bg-blue-600 transition-colors active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center text-xl shrink-0">
                🚗
              </div>
              <div className="text-left">
                <p className="font-black text-white text-[15px]">T맵</p>
                <p className="text-xs text-blue-100">T맵으로 길안내</p>
              </div>
              <span className="ml-auto text-white">→</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
