import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FacilityCategory } from '../../data/airportFacilities'
import type { KakaoMapStatus } from '../../hooks/useKakaoMap'
import type { KakaoPlace } from '../../services/kakaoLocalService'

/* eslint-disable @typescript-eslint/no-explicit-any */

const CATEGORY_META: { id: FacilityCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all',      label: '전체',  icon: '🗺️' },
  { id: 'food',     label: '식당',  icon: '🍽️' },
  { id: 'dutyfree', label: '면세점', icon: '🛍️' },
  { id: 'lounge',   label: '라운지', icon: '🛋️' },
  { id: 'atm',      label: 'ATM',   icon: '🏧' },
  { id: 'exchange', label: '환전',  icon: '💱' },
  { id: 'pharmacy', label: '약국',  icon: '💊' },
]

// 인천공항 T1·T2 실제 좌표
const TERMINALS = [
  { id: 'T1', label: '제1터미널', lat: 37.4491, lng: 126.4505, color: '#1DB954' },
  { id: 'T2', label: '제2터미널', lat: 37.4697, lng: 126.4426, color: '#3498DB' },
]

const AIRPORT_CENTER = { lat: 37.4602, lng: 126.4462 }

export interface HighlightedPlace {
  lat: number
  lng: number
  name: string
}

interface Props {
  selectedCategory: FacilityCategory | 'all'
  onCategoryChange: (cat: FacilityCategory | 'all') => void
  userLocation: { lat: number; lng: number } | null
  mapLoaded: boolean
  mapStatus: KakaoMapStatus
  highlightedPlace?: HighlightedPlace | null
  onMapClick?: (lat: number, lng: number) => void
}

function buildMap(container: HTMLDivElement, level: number): any {
  const kakao = window.kakao
  const center = new kakao.maps.LatLng(AIRPORT_CENTER.lat, AIRPORT_CENTER.lng)
  return new kakao.maps.Map(container, { center, level })
}

function placeTerminalMarkers(map: any): any[] {
  const kakao = window.kakao
  return TERMINALS.map((t) => {
    const position = new kakao.maps.LatLng(t.lat, t.lng)
    const content = `
      <div style="
        display:flex;flex-direction:column;align-items:center;gap:4px;
        transform:translate(-50%,-100%);cursor:default;
      ">
        <div style="
          background:${t.color};color:white;font-weight:900;font-size:13px;
          padding:6px 14px;border-radius:20px;
          box-shadow:0 3px 10px rgba(0,0,0,0.25);
          white-space:nowrap;
        ">${t.id} ${t.label}</div>
        <div style="
          width:10px;height:10px;background:${t.color};
          clip-path:polygon(0 0,100% 0,50% 100%);
        "></div>
      </div>`
    const overlay = new kakao.maps.CustomOverlay({ position, content, zIndex: 3 })
    overlay.setMap(map)
    return overlay
  })
}

function placeUserMarker(map: any, location: { lat: number; lng: number }): any {
  const kakao = window.kakao
  const position = new kakao.maps.LatLng(location.lat, location.lng)
  const content = `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#3B82F6;border:3px solid #fff;
    box-shadow:0 0 0 5px rgba(59,130,246,0.2);
    transform:translate(-50%,-50%);
  "></div>`
  const overlay = new kakao.maps.CustomOverlay({ position, content, zIndex: 5 })
  overlay.setMap(map)
  map.panTo(position)
  return overlay
}

function placeHighlightMarker(map: any, place: HighlightedPlace): any {
  const kakao = window.kakao
  const position = new kakao.maps.LatLng(place.lat, place.lng)
  const content = `
    <div style="
      display:flex;flex-direction:column;align-items:center;gap:3px;
      transform:translate(-50%,-100%);
    ">
      <div style="
        background:#FF5733;color:white;font-weight:900;font-size:12px;
        padding:5px 12px;border-radius:20px;
        box-shadow:0 3px 10px rgba(0,0,0,0.3);
        white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;
      ">${place.name}</div>
      <div style="
        width:10px;height:10px;background:#FF5733;
        clip-path:polygon(0 0,100% 0,50% 100%);
      "></div>
    </div>`
  const overlay = new kakao.maps.CustomOverlay({ position, content, zIndex: 10 })
  overlay.setMap(map)
  map.panTo(position)
  map.setLevel(3, { animate: true })
  return overlay
}

/** 공통 지도 초기화 hook 로직 */
function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  mapRef: React.MutableRefObject<any>,
  markersRef: React.MutableRefObject<any[]>,
  userMarkerRef: React.MutableRefObject<any>,
  highlightMarkerRef: React.MutableRefObject<any>,
  mapLoaded: boolean,
  userLocation: { lat: number; lng: number } | null,
  highlightedPlace: HighlightedPlace | null | undefined,
  onMapClick: ((lat: number, lng: number) => void) | undefined,
  level: number,
) {
  useEffect(() => {
    if (!mapLoaded || !containerRef.current || mapRef.current) return
    if (!window.kakao?.maps) return
    mapRef.current = buildMap(containerRef.current, level)
    markersRef.current = placeTerminalMarkers(mapRef.current)
  }, [mapLoaded, containerRef, mapRef, markersRef, level])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.kakao?.maps) return
    if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null }
    if (userLocation) userMarkerRef.current = placeUserMarker(mapRef.current, userLocation)
  }, [mapLoaded, userLocation, mapRef, userMarkerRef])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.kakao?.maps) return
    if (highlightMarkerRef.current) { highlightMarkerRef.current.setMap(null); highlightMarkerRef.current = null }
    if (highlightedPlace) highlightMarkerRef.current = placeHighlightMarker(mapRef.current, highlightedPlace)
  }, [mapLoaded, highlightedPlace, mapRef, highlightMarkerRef])

  // 지도 클릭 이벤트 → 좌표 전달
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.kakao?.maps || !onMapClick) return
    const handler = (e: any) => {
      const lat: number = e.latLng.getLat()
      const lng: number = e.latLng.getLng()
      onMapClick(lat, lng)
    }
    window.kakao.maps.event.addListener(mapRef.current, 'click', handler)
    return () => {
      if (mapRef.current) window.kakao?.maps?.event?.removeListener(mapRef.current, 'click', handler)
    }
  }, [mapLoaded, onMapClick, mapRef])
}

function PreviewMap({
  userLocation, mapLoaded, onExpand, highlightedPlace, onMapClick,
}: {
  userLocation: { lat: number; lng: number } | null
  mapLoaded: boolean
  onExpand: () => void
  highlightedPlace?: HighlightedPlace | null
  onMapClick?: (lat: number, lng: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const highlightMarkerRef = useRef<any>(null)

  useMapInstance(containerRef, mapRef, markersRef, userMarkerRef, highlightMarkerRef, mapLoaded, userLocation, highlightedPlace, onMapClick, 5)

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-brand-border" style={{ height: 240 }}>
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={onExpand}
        className="absolute top-3 right-3 z-10 bg-white border border-brand-border rounded-xl px-3 py-1.5 text-xs font-bold text-brand-ink shadow-sm flex items-center gap-1.5 hover:border-brand-green transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        확대
      </button>
      {/* 범례 */}
      <div className="absolute bottom-3 left-3 z-10 flex gap-2">
        {TERMINALS.map((t) => (
          <div key={t.id} className="flex items-center gap-1 bg-white/90 rounded-lg px-2 py-1 text-[10px] font-bold shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
            {t.id}
          </div>
        ))}
      </div>
    </div>
  )
}

function FullscreenMapModal({
  userLocation, mapLoaded, selectedCategory, onCategoryChange, onClose, highlightedPlace, onMapClick,
}: {
  userLocation: { lat: number; lng: number } | null
  mapLoaded: boolean
  selectedCategory: FacilityCategory | 'all'
  onCategoryChange: (cat: FacilityCategory | 'all') => void
  onClose: () => void
  highlightedPlace?: HighlightedPlace | null
  onMapClick?: (lat: number, lng: number) => void
}) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<any>(null)
  const markersRef    = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const highlightMarkerRef = useRef<any>(null)

  useMapInstance(containerRef, mapRef, markersRef, userMarkerRef, highlightMarkerRef, mapLoaded, userLocation, highlightedPlace, onMapClick, 5)

  useEffect(() => {
    if (mapRef.current) setTimeout(() => mapRef.current?.relayout?.(), 80)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border shrink-0">
        <div>
          <p className="font-bold text-brand-black">인천공항 지도</p>
          <p className="text-[11px] text-brand-muted mt-0.5">T1 · T2 위치 및 내 위치 확인</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 카테고리 칩 (시설 필터) */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto shrink-0 border-b border-brand-border">
        {CATEGORY_META.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === c.id
                ? 'bg-brand-green text-white'
                : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-green'
            }`}
          >
            <span>{c.icon}</span><span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* 지도 */}
      <div ref={containerRef} className="flex-1 w-full" />

      {/* 안내 */}
      <div className="shrink-0 bg-brand-surface border-t border-brand-border px-4 py-3">
        <p className="text-xs text-brand-muted text-center">
          🟢 T1 제1터미널 &nbsp;·&nbsp; 🔵 T2 제2터미널 &nbsp;·&nbsp; 시설 목록은 아래 리스트에서 확인
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default function AirportMap({
  selectedCategory,
  onCategoryChange,
  userLocation,
  mapLoaded,
  mapStatus,
  highlightedPlace,
  onMapClick,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!mapLoaded) {
    return (
      <div
        className="w-full bg-brand-surface border border-brand-border rounded-xl flex flex-col items-center justify-center gap-2 px-6 text-center"
        style={{ height: 240 }}
      >
        {mapStatus === 'loading' && (
          <><div className="text-3xl animate-pulse">🗺️</div>
          <p className="text-sm font-semibold text-brand-muted">지도 불러오는 중...</p></>
        )}
        {mapStatus === 'error' && (
          <><div className="text-3xl">⚠️</div>
          <p className="text-sm font-semibold text-brand-red">지도 로드 실패</p>
          <p className="text-xs text-brand-muted">카카오 개발자 센터 → 플랫폼 → Web에<br/><b>http://localhost:5173</b> 등록 필요</p></>
        )}
        {mapStatus === 'idle' && (
          <><div className="text-3xl">🗺️</div>
          <p className="text-sm font-semibold text-brand-muted">카카오맵 API 키 필요</p>
          <p className="text-xs text-brand-muted">.env.local에 VITE_KAKAO_MAP_KEY 추가 후<br/>개발 서버를 재시작하세요</p></>
        )}
      </div>
    )
  }

  return (
    <>
      {/* 카테고리 칩 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_META.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === c.id
                ? 'bg-brand-green text-white shadow-sm'
                : 'bg-white border border-brand-border text-brand-muted hover:border-brand-green hover:text-brand-green'
            }`}
          >
            <span className="text-sm">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* 미리보기 지도 */}
      <PreviewMap
        userLocation={userLocation}
        mapLoaded={mapLoaded}
        onExpand={() => setExpanded(true)}
        highlightedPlace={highlightedPlace}
        onMapClick={onMapClick}
      />

      {/* 안내 문구 */}
      <p className="text-xs text-brand-muted text-center -mt-1">
        지도를 확대하면 가게를 클릭할 수 있어요 · 시설 목록은 아래에서 확인
      </p>

      {expanded && (
        <FullscreenMapModal
          userLocation={userLocation}
          mapLoaded={mapLoaded}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onClose={() => setExpanded(false)}
          highlightedPlace={highlightedPlace}
          onMapClick={onMapClick}
        />
      )}
    </>
  )
}
