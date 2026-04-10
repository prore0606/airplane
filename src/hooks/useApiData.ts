import { useCallback, useEffect, useRef, useState } from 'react'

export interface ApiState<T> {
  data: T[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => void
}

/**
 * 단일 책임: 비동기 데이터 패칭 상태 관리
 * 모든 API 훅의 공통 로직을 담당
 * fetcher 함수만 주입받아 동작 — 의존성 역전 원칙 준수
 */
export function useApiData<T>(fetcher: () => Promise<T[]>): ApiState<T> {
  const [state, setState] = useState<Omit<ApiState<T>, 'refetch'>>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcherRef.current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null, lastUpdated: new Date() })
      })
      .catch((err: Error) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: err.message }))
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    return refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, refetch }
}
