import { useEffect, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any
  }
}

export type KakaoMapStatus = 'idle' | 'loading' | 'ready' | 'error'

export function useKakaoMap(appKey: string | undefined): { loaded: boolean; status: KakaoMapStatus } {
  const [status, setStatus] = useState<KakaoMapStatus>('idle')

  useEffect(() => {
    if (!appKey) {
      setStatus('idle')
      return
    }

    // 이미 완전히 로드된 경우
    if (window.kakao?.maps?.Map) {
      setStatus('ready')
      return
    }

    setStatus('loading')

    // 스크립트 태그는 있지만 load() 미호출 (HMR 재마운트)
    if (document.getElementById('kakao-maps-sdk')) {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => setStatus('ready'))
      }
      return
    }

    // 최초 로드
    const script = document.createElement('script')
    script.id = 'kakao-maps-sdk'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
    script.onerror = () => {
      console.error('[KakaoMap] 스크립트 로드 실패. API 키 또는 도메인 등록 확인')
      setStatus('error')
    }
    script.onload = () => {
      if (!window.kakao?.maps) {
        console.error('[KakaoMap] kakao.maps 없음 — 도메인이 등록됐는지 확인')
        setStatus('error')
        return
      }
      window.kakao.maps.load(() => {
        console.log('[KakaoMap] 로드 완료')
        setStatus('ready')
      })
    }
    document.head.appendChild(script)
  }, [appKey])

  return { loaded: status === 'ready', status }
}
