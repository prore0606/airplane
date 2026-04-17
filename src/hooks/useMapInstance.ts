import { useEffect, useRef, useState } from 'react'
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
  const containerRef      = useRef<HTMLDivElement>(null)
  const mapRef            = useRef<any>(null)
  const markersRef        = useRef<any[]>([])
  const userMarkerRef     = useRef<any>(null)
  const highlightRef      = useRef<any>(null)
  const clickPinRef       = useRef<any>(null)
  const [unauthorized, setUnauthorized] = useState(false)

  const { mapLoaded, userLocation, highlightedPlace, clickedPlace, onMapClick } = options

  useEffect(() => {
    if (!mapLoaded || !containerRef.current || mapRef.current || !window.naver?.maps) return
    mapRef.current = buildMap(containerRef.current)
    markersRef.current = placeTerminalMarkers(mapRef.current)
  }, [mapLoaded])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    // 인증 실패 감지 (NCP 허용 도메인 미등록)
    const authListener = window.naver.maps.Event.addListener(
      mapRef.current, 'unauthorized',
      () => { setUnauthorized(true); console.error('[NaverMap] 인증 실패 — NCP 콘솔 > 애플리케이션 > Web 서비스 URL에 http://localhost:5173 추가 필요') },
    )
    const t = setTimeout(() => window.naver?.maps.Event.trigger(mapRef.current, 'resize'), 200)
    return () => { clearTimeout(t); window.naver?.maps.Event.removeListener(authListener) }
  }, [mapLoaded])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null }
    if (userLocation) userMarkerRef.current = placeUserMarker(mapRef.current, userLocation)
  }, [mapLoaded, userLocation])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver?.maps) return
    if (highlightRef.current) { highlightRef.current.setMap(null); highlightRef.current = null }
    if (highlightedPlace) highlightRef.current = placeHighlightMarker(mapRef.current, highlightedPlace)
  }, [mapLoaded, highlightedPlace])

  useEffect(() => {
    if (!clickedPlace && clickPinRef.current) { clickPinRef.current.setMap(null); clickPinRef.current = null }
  }, [clickedPlace])

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

  return { containerRef, clickPinRef, unauthorized }
}
