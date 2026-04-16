const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY

// 인천공항 T1 중심 좌표
const ICN_LNG = 126.4505
const ICN_LAT = 37.4491

export interface KakaoPlace {
  id: string
  place_name: string
  category_name: string
  category_group_code: string
  address_name: string
  road_address_name: string
  phone: string
  place_url: string
  distance: string
  x: string // longitude
  y: string // latitude
}

// 카테고리별 검색 설정
const CATEGORY_SEARCH: Record<string, { code?: string; keyword?: string }> = {
  food:     { keyword: '인천국제공항 식당' },
  cafe:     { keyword: '인천국제공항 카페' },
  dutyfree: { keyword: '인천공항 면세점' },
  lounge:   { keyword: '인천공항 라운지' },
  atm:      { keyword: '인천공항 ATM' },
  exchange: { keyword: '인천공항 환전' },
  pharmacy: { code: 'PM9' },
  shopping: { keyword: '인천공항 쇼핑' },
}

// 지도 클릭 좌표 근처 장소 검색
// FD6=음식점 CE7=카페 CS2=편의점 MT1=대형마트/면세점 CT1=문화시설
// AT4=관광명소 BK9=은행 PM9=약국 HP8=병원 AD5=숙박
const NEARBY_CATEGORY_CODES = ['FD6', 'CE7', 'CS2', 'MT1', 'CT1', 'AT4', 'BK9', 'PM9', 'HP8', 'AD5']

async function searchByCategory(lat: number, lng: number, radius: number): Promise<KakaoPlace | null> {
  const results = await Promise.all(
    NEARBY_CATEGORY_CODES.map(async (code) => {
      const params = new URLSearchParams({
        category_group_code: code,
        x: String(lng),
        y: String(lat),
        radius: String(radius),
        size: '3',
        sort: 'distance',
      })
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/category.json?${params}`,
          { headers: { Authorization: `KakaoAK ${REST_KEY}` } },
        )
        if (!res.ok) return []
        const data = await res.json()
        return (data.documents ?? []) as KakaoPlace[]
      } catch {
        return []
      }
    }),
  )
  const all = results.flat()
  if (all.length === 0) return null
  all.sort((a, b) => Number(a.distance) - Number(b.distance))
  return all[0]
}

async function searchByKeyword(lat: number, lng: number, keyword: string, radius: number): Promise<KakaoPlace | null> {
  const params = new URLSearchParams({
    query: keyword,
    x: String(lng),
    y: String(lat),
    radius: String(radius),
    size: '5',
    sort: 'distance',
  })
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`,
      { headers: { Authorization: `KakaoAK ${REST_KEY}` } },
    )
    if (!res.ok) return null
    const data = await res.json()
    const places = (data.documents ?? []) as KakaoPlace[]
    return places.length > 0 ? places[0] : null
  } catch {
    return null
  }
}

export async function searchNearbyPlace(lat: number, lng: number): Promise<KakaoPlace | null> {
  console.log('[searchNearbyPlace] searching lat=', lat, 'lng=', lng)

  // 1단계: 가까운 반경 카테고리 검색
  const r1 = await searchByCategory(lat, lng, 200)
  if (r1) { console.log('[searchNearbyPlace] found by category 200m:', r1.place_name); return r1 }

  // 2단계: 더 넓은 반경 카테고리 검색
  const r2 = await searchByCategory(lat, lng, 700)
  if (r2) { console.log('[searchNearbyPlace] found by category 700m:', r2.place_name); return r2 }

  // 3단계: 키워드 "인천공항"으로 주변 검색 (터미널 내 모든 시설 포함)
  const r3 = await searchByKeyword(lat, lng, '인천공항', 1500)
  if (r3) { console.log('[searchNearbyPlace] found by keyword:', r3.place_name); return r3 }

  console.log('[searchNearbyPlace] nothing found')
  return null
}

export async function searchAirportFacilities(
  category: string,
): Promise<KakaoPlace[]> {
  const config = CATEGORY_SEARCH[category]
  if (!config) return []

  const params = new URLSearchParams({
    x: String(ICN_LNG),
    y: String(ICN_LAT),
    radius: '2000',
    size: '15',
    sort: 'distance',
  })

  let url: string
  if (config.code) {
    // 카테고리 코드로 검색
    params.set('category_group_code', config.code)
    url = `https://dapi.kakao.com/v2/local/search/category.json?${params}`
  } else {
    // 키워드로 검색
    params.set('query', config.keyword!)
    url = `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`
  }

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
  })

  if (!res.ok) {
    console.error('Kakao Local API error:', res.status)
    return []
  }

  const data = await res.json()
  return data.documents ?? []
}
