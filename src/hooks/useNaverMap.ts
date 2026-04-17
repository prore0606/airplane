import { useEffect, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    naver: any
    navermap_authFailure?: () => void  // NCP 공식 인증 실패 콜백
  }
}

export type NaverMapStatus = 'idle' | 'loading' | 'ready' | 'error' | 'auth_error'

export function useNaverMap(clientId: string | undefined): { loaded: boolean; status: NaverMapStatus } {
  const [status, setStatus] = useState<NaverMapStatus>(clientId ? 'loading' : 'idle')

  useEffect(() => {
    if (!clientId) { setStatus('idle'); return }

    // NCP 공식 인증 실패 감지 콜백 — 포트 포함 URL 등록 시 발생
    window.navermap_authFailure = () => {
      console.error(
        '[NaverMap] 인증 실패\n' +
        '→ NCP 콘솔 > Application > Web 서비스 URL\n' +
        '→ http://localhost:5173 삭제 후 http://localhost 로 재등록 (포트 제외)'
      )
      setStatus('auth_error')
    }

    if (window.naver?.maps?.Map) { setStatus('ready'); return }

    if (document.getElementById('naver-map-sdk')) {
      const existing = document.getElementById('naver-map-sdk')!
      existing.addEventListener('load', () => setStatus('ready'), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'naver-map-sdk'
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
    script.async = true
    script.onload  = () => setStatus('ready')
    script.onerror = () => { console.error('[NaverMap] SDK 로드 실패'); setStatus('error') }
    document.head.appendChild(script)

    return () => { window.navermap_authFailure = undefined }
  }, [clientId])

  return { loaded: status === 'ready', status }
}
