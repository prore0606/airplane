import { useState, useCallback, useEffect } from 'react'
import { searchAirportFacilities, searchNearbyPlace } from '../services/kakaoLocalService'
import type { KakaoPlace } from '../services/kakaoLocalService'
import type { FacilityCategory } from '../data/airportFacilities'
import type { HighlightedPlace } from '../components/map/mapHelpers'

export function useMapPageState(initialCategory: FacilityCategory | 'all' = 'all') {
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | 'all'>(initialCategory)
  const [selectedPlace,    setSelectedPlace]    = useState<KakaoPlace | null>(null)
  const [userLocation,     setUserLocation]     = useState<{ lat: number; lng: number } | null>(null)
  const [locating,         setLocating]         = useState(false)
  const [locationError,    setLocationError]    = useState<string | null>(null)
  const [places,           setPlaces]           = useState<KakaoPlace[]>([])
  const [searchLoading,    setSearchLoading]    = useState(false)
  const [mapClickedPlace,  setMapClickedPlace]  = useState<KakaoPlace | null>(null)
  const [mapSearching,     setMapSearching]     = useState(false)
  const [mapNotFound,      setMapNotFound]      = useState(false)

  useEffect(() => {
    if (selectedCategory === 'all') { setPlaces([]); return }
    setSearchLoading(true)
    searchAirportFacilities(selectedCategory).then(setPlaces).finally(() => setSearchLoading(false))
  }, [selectedCategory])

  const highlightedPlace: HighlightedPlace | null = selectedPlace
    ? { lat: parseFloat(selectedPlace.y), lng: parseFloat(selectedPlace.x), name: selectedPlace.place_name }
    : null

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setSelectedPlace(null)
    setMapSearching(true)
    setMapNotFound(false)
    const found = await searchNearbyPlace(lat, lng)
    setMapSearching(false)
    if (found) { setMapClickedPlace(found) }
    else { setMapClickedPlace(null); setMapNotFound(true) }
  }, [])

  const handleFacilitySelect = useCallback((place: KakaoPlace) => {
    setSelectedPlace(place)
    setMapClickedPlace(place)
    setMapNotFound(false)
    setMapSearching(false)
  }, [])

  const handleCloseClickedPlace = useCallback(() => {
    setMapClickedPlace(null)
    setMapNotFound(false)
  }, [])

  function handleLocate() {
    if (!navigator.geolocation) { setLocationError('위치 서비스를 지원하지 않아요.'); return }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserLocation({ lat: coords.latitude, lng: coords.longitude }); setLocating(false) },
      ()           => { setLocationError('위치 접근이 거부됐어요.'); setLocating(false) },
      { timeout: 10000, maximumAge: 30000 },
    )
  }

  return {
    selectedCategory, setSelectedCategory,
    selectedPlace,    setSelectedPlace,
    userLocation, locating, locationError, handleLocate,
    places, searchLoading,
    mapClickedPlace, mapSearching, mapNotFound,
    highlightedPlace,
    handleMapClick, handleFacilitySelect, handleCloseClickedPlace,
  }
}
