/**
 * 단일 책임: 공공데이터 API 공통 fetch 로직
 * 각 서비스(혼잡도/주차/셔틀)에서 import해서 사용
 */

const KEY = () => import.meta.env.VITE_DATA_GO_KR_API_KEY as string

export async function fetchAirportApi<T>(
  baseUrl: string,
  extraParams: Record<string, string> = {},
): Promise<T[]> {
  const params = new URLSearchParams({
    serviceKey: KEY(),
    type: 'json',
    numOfRows: '20',
    pageNo: '1',
    ...extraParams,
  })

  const res = await fetch(`${baseUrl}?${params}`, {
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()

  // 공공데이터 API 공통 응답 구조
  const items = json?.response?.body?.items
  if (!items) throw new Error('no items')

  // items가 배열인 경우와 단일 객체인 경우 모두 처리
  return Array.isArray(items) ? items : [items]
}
