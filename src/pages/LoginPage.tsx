import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading]   = useState(false)
  const [appleMsg, setAppleMsg] = useState(false)

  async function handle() {
    setLoading(true)
    await signInWithGoogle()
    setLoading(false)
  }

  function handleApple() {
    setAppleMsg(true)
    setTimeout(() => setAppleMsg(false), 2500)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 60%, #1a3320 100%)' }}
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.25), transparent 65%)' }} />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.15), transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-brand-green flex items-center justify-center shadow-2xl shadow-brand-green/40 text-4xl">
            ✈️
          </div>
          <div className="text-center">
            <p className="font-display font-black text-3xl text-white tracking-tight">
              출국<span className="text-brand-green">메이트</span>
            </p>
            <p className="text-white/45 text-sm mt-1">Airport Mate · 공항 가이드</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['✈️ 실시간 항공', '🚉 역별 길안내', '🗺️ 공항 지도', '🤖 AI 체크리스트'].map(f => (
            <span key={f} className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
              {f}
            </span>
          ))}
        </div>

        <div className="w-full space-y-3">
          <p className="text-center text-xs font-semibold text-white/35 uppercase tracking-widest">
            간편 로그인 · Sign in
          </p>
          <button
            onClick={handle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[15px] transition-all disabled:opacity-60 active:scale-[0.98] shadow-lg"
            style={{ background: 'rgba(255,255,255,0.09)', color: 'white', border: '1.5px solid rgba(255,255,255,0.15)' }}
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Google로 계속하기 · Continue with Google
          </button>
          <button
            onClick={handleApple}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(255,255,255,0.1)' }}
          >
            <svg width="18" height="22" viewBox="0 0 814 1000" fill="currentColor">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.5-49 192.5-49 30.9 0 111.4 2.6 166.3 99zm-209.3-199.5c31.2-36.9 53.5-88.1 53.5-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.1-71.3z"/>
            </svg>
            Apple로 계속하기 · Continue with Apple
          </button>
          {appleMsg && (
            <p className="text-center text-[12px] font-semibold animate-pulse"
              style={{ color: '#4ade80' }}>
              🚧 준비 중입니다 · Coming soon
            </p>
          )}
        </div>

        <p className="text-center text-[11px] text-white/25 leading-relaxed">
          로그인 시 이용약관에 동의합니다<br/>By continuing, you agree to our Terms
        </p>
      </div>
    </div>
  )
}
