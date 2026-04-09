import { useEffect, useState } from 'react'

export interface ApiState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

/**
 * 단일 책임: 비동기 데이터 패칭 상태 관리
 * 모든 API 훅의 공통 로직을 담당
 * fetcher 함수만 주입받아 동작 — 의존성 역전 원칙 준수
 */
export function useApiData<T>(fetcher: () => Promise<T[]>): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ data: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ data: [], loading: true, error: null })

    fetcher()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }) })
      .catch((err: Error) => { if (!cancelled) setState({ data: [], loading: false, error: err.message }) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
