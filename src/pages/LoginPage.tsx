import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle, signInWithKakao } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'kakao' | null>(null)

  async function handleKakao() {
    setLoadingProvider('kakao')
    await signInWithKakao()
    setLoadingProvider(null)
  }

  async function handleGoogle() {
    setLoadingProvider('google')
    await signInWithGoogle()
    setLoadingProvider(null)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 60%, #1a3320 100%)' }}
    >
      {/* 배경 글로우 */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.25), transparent 65%)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.15), transparent 65%)' }}
      />

      {/* 카드 */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* 로고 */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-brand-green flex items-center justify-center shadow-2xl text-4xl">
            ✈️
          </div>
          <div className="text-center">
            <p className="font-display font-black text-3xl text-white tracking-tight">
              출국<span className="text-brand-green">메이트</span>
            </p>
            <p className="text-white/50 text-sm mt-1">AI 출국 여정 동반자</p>
          </div>
        </div>

        {/* 슬로건 */}
        <div className="text-center space-y-2">
          <p className="text-white font-bold text-lg leading-snug">
            항공권 스캔 한 번으로<br/>출국 준비 끝
          </p>
          <p className="text-white/40 text-sm leading-relaxed">
            체크리스트 · 실시간 항공편 · 주차 저장<br/>공항 지도까지 한 곳에서
          </p>
        </div>

        {/* 기능 뱃지 */}
        <div className="flex flex-wrap justify-center gap-2">
          {['✈️ 실시간 항공', '🅿️ GPS 주차', '🤖 AI 체크리스트', '🗺️ 공항 지도'].map((f) => (
            <span
              key={f}
              className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full space-y-3">
          <p className="text-center text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            간편 로그인으로 시작
          </p>

          {/* 카카오 */}
          <button
            onClick={handleKakao}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[15px] transition-all disabled:opacity-60 active:scale-[0.98] shadow-lg"
            style={{ background: '#FEE500', color: '#191919' }}
          >
            {loadingProvider === 'kakao' ? (
              <span className="animate-spin text-xl">⏳</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.822 1.658 5.297 4.154 6.818l-1.05 3.906c-.09.33.27.6.563.415L9.9 19.53A11.22 11.22 0 0012 19.818c5.523 0 10-3.477 10-7.909S17.523 3 12 3z"/>
              </svg>
            )}
            카카오로 시작하기
          </button>

          {/* 구글 */}
          <button
            onClick={handleGoogle}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[15px] transition-all disabled:opacity-60 active:scale-[0.98] shadow-lg"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.15)' }}
          >
            {loadingProvider === 'google' ? (
              <span className="animate-spin text-xl">⏳</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Google로 시작하기
          </button>
        </div>

        <p className="text-center text-[11px] text-white/25 leading-relaxed">
          로그인 시 이용약관 및 개인정보처리방침에<br/>동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  )
}
