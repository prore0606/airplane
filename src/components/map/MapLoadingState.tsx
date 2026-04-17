import type { NaverMapStatus } from '../../hooks/useNaverMap'

export default function MapLoadingState({ status }: { status: NaverMapStatus }) {
  if (status === 'auth_error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 text-center bg-amber-50">
        <p className="text-4xl">🔐</p>
        <p className="font-bold text-amber-800 text-base">NCP 인증 실패</p>
        <div className="bg-white border border-amber-200 rounded-xl p-4 text-left max-w-xs w-full space-y-3">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">해결 방법</p>
          <ol className="text-xs text-amber-900 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>console.ncloud.com 접속</li>
            <li>Application → 수정 클릭</li>
            <li>Web 서비스 URL 수정:</li>
          </ol>
          <div className="space-y-1">
            <p className="text-[10px] text-red-500 font-mono line-through">http://localhost:5173</p>
            <p className="text-[10px] text-green-700 font-mono font-bold">http://localhost</p>
          </div>
          <p className="text-[10px] text-amber-600">포트 번호 포함 시 인증 실패 (NCP 정책)</p>
        </div>
      </div>
    )
  }

  const CONFIG = {
    loading: { icon: '🗺️', msg: '지도 불러오는 중...', pulse: true,  sub: undefined },
    error:   { icon: '⚠️', msg: '지도 로드 실패',      pulse: false, sub: 'SDK 스크립트 로드 오류' },
    idle:    { icon: '🗺️', msg: 'API 키 없음',         pulse: false, sub: '.env.local에 VITE_NAVER_MAP_CLIENT_ID 추가' },
    ready:   { icon: '🗺️', msg: '',                    pulse: false, sub: undefined },
  }
  const { icon, msg, sub, pulse } = CONFIG[status as keyof typeof CONFIG] ?? CONFIG.idle

  return (
    <div className="w-full h-full bg-brand-surface flex flex-col items-center justify-center gap-3 px-8 text-center">
      <div className={`text-5xl ${pulse ? 'animate-pulse' : ''}`}>{icon}</div>
      {msg && <p className="text-sm font-semibold text-brand-muted">{msg}</p>}
      {sub  && <p className="text-xs text-brand-muted">{sub}</p>}
    </div>
  )
}
