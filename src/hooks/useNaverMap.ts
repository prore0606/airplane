import { useEffect, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    naver: any
  }
}

export type NaverMapStatus = 'idle' | 'loading' | 'ready' | 'error'

export function useNaverMap(clientId: string | undefined): { loaded: boolean; status: NaverMapStatus } {
  const [status, setStatus] = useState<NaverMapStatus>(clientId ? 'loading' : 'idle')

  useEffect(() => {
    if (!clientId) { setStatus('idle'); return }

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
    script.onload = () => { console.log('[NaverMap] 로드 완료'); setStatus('ready') }
    script.onerror = () => { console.error('[NaverMap] 로드 실패'); setStatus('error') }
    document.head.appendChild(script)
  }, [clientId])

  return { loaded: status === 'ready', status }
}
