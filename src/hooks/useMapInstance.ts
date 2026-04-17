import { useEffect, useRef } from 'react'
import {
  buildMap, placeTerminalMarkers, placeUserMarker,
  placeHighlightMarker, placeClickPin,
} from '../components/map/mapHelpers'
import type { HighlightedPlace } from '../components/map/mapHelpers'
import type { KakaoPlace } from '../services/kakaoLocalService'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global { interface Window { naver: any } }

interface Options {
  mapLoaded: boolean
  userLocation: { lat: number; lng: number } | null
  highlightedPlace?: HighlightedPlace | null
  clickedPlace?: KakaoPlace | null
  onMapClick?: (lat: number, lng: number) => void
}

export function useMapInstance(options: Options) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<any>(null)
  const markersRef    = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const highlightRef  = useRef<any>(null)
  const clickPinRef   = useRef<any>(null)

  const { mapLoaded, userLocation, highlightedPlace, clickedPlace, onMapClick } = options

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !containerRef.current || mapRef.current || !window.naver?.maps) return
    mapRef.current = buildMap(containerRef.current)
    markersRef.current = placeTerminalMarkers(mapRef.current)
  }, [mapLoaded])

  // 컨테이너 크기 변경 후 리사이즈 트리거 (200ms 여유)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    const t = setTimeout(() => window.naver.maps.Event.trigger(mapRef.current, 'resize'), 200)
    return () => clearTimeout(t)
  }, [mapLoaded])

  // 현재 위치 마커
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null }
    if (userLocation) userMarkerRef.current = placeUserMarker(mapRef.current, userLocation)
  }, [mapLoaded, userLocation])

  // 시설 하이라이트 마커
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    if (highlightRef.current) { highlightRef.current.setMap(null); highlightRef.current = null }
    if (highlightedPlace) highlightRef.current = placeHighlightMarker(mapRef.current, highlightedPlace)
  }, [mapLoaded, highlightedPlace])

  // 클릭 핀 제거
  useEffect(() => {
    if (!clickedPlace && clickPinRef.current) { clickPinRef.current.setMap(null); clickPinRef.current = null }
  }, [clickedPlace])

  // 지도 클릭 이벤트
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps || !onMapClick) return
    const map = mapRef.current
    const listener = window.naver.maps.Event.addListener(map, 'click', (e: any) => {
      const lat = e.coord.lat(), lng = e.coord.lng()
      if (clickPinRef.current) { clickPinRef.current.setMap(null); clickPinRef.current = null }
      clickPinRef.current = placeClickPin(map, lat, lng)
      onMapClick(lat, lng)
    })
    return () => window.naver.maps.Event.removeListener(listener)
  }, [mapLoaded, onMapClick])

  return { containerRef, clickPinRef }
}
