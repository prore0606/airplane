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

// 지도 클릭 좌표 근처 장소 검색 (카테고리 코드 병렬 탐색)
const NEARBY_CATEGORY_CODES = ['FD6', 'CE7', 'CS2', 'HP8', 'PM9', 'BK9', 'OL7', 'AT4', 'SW8']

export async function searchNearbyPlace(lat: number, lng: number): Promise<KakaoPlace | null> {
  const search = async (radius: number): Promise<KakaoPlace | null> => {
    const results = await Promise.all(
      NEARBY_CATEGORY_CODES.map(async (code) => {
        const params = new URLSearchParams({
          category_group_code: code,
          x: String(lng),
          y: String(lat),
          radius: String(radius),
          size: '1',
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

  return (await search(30)) ?? (await search(80))
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
