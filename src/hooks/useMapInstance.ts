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

  // 지도 초기화 — rAF 후 실행해 컨테이너 레이아웃이 완료된 시점을 보장
  useEffect(() => {
    if (!mapLoaded || !containerRef.current || mapRef.current || !window.naver?.maps) return
    const container = containerRef.current
    const rafId = requestAnimationFrame(() => {
      if (mapRef.current || !container) return
      mapRef.current = buildMap(container)
      markersRef.current = placeTerminalMarkers(mapRef.current)
      // 초기화 직후 즉시 resize → 타일 요청 유도
      window.naver.maps.Event.trigger(mapRef.current, 'resize')
    })
    return () => cancelAnimationFrame(rafId)
  }, [mapLoaded])

  // 레이아웃 확정 후 추가 resize (컨테이너 크기가 늦게 결정되는 경우 대비)
  useEffect(() => {
    if (!mapLoaded) return
    const t1 = setTimeout(() => {
      if (mapRef.current && window.naver?.maps) window.naver.maps.Event.trigger(mapRef.current, 'resize')
    }, 300)
    const t2 = setTimeout(() => {
      if (mapRef.current && window.naver?.maps) window.naver.maps.Event.trigger(mapRef.current, 'resize')
    }, 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
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
