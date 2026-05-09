import { useAuth } from '../../../context/AuthContext'
import { useUserMode } from '../../../context/UserModeContext'
import LanguageSelector from './LanguageSelector'

export default function ForeignerMyPage() {
  const { user, signOut } = useAuth()
  const { resetMode } = useUserMode()
  const name  = user?.user_metadata?.full_name  ?? 'Traveler'
  const email = user?.email ?? ''

  return (
    <div className="flex flex-col h-full bg-brand-surface">
      {/* Dark header */}
      <div
        className="px-5 pt-10 pb-7 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 70%, #1a3320 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.18), transparent 65%)' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl shrink-0">
            👤
          </div>
          <div className="min-w-0">
            <p className="font-display font-black text-[18px] text-white truncate">{name}</p>
            <p className="text-[12px] text-white/45 truncate mt-0.5">{email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
          <LanguageSelector />
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm">
            <button onClick={resetMode}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-brand-pale transition-colors">
              <span className="text-xl">🇰🇷</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-[14px] text-brand-black">Switch to Korean Mode</p>
                <p className="text-[11px] text-brand-muted">내국인 모드로 변경</p>
              </div>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1l4 4-4 4" stroke="#8A9E92" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <button onClick={signOut}
            className="w-full py-4 rounded-2xl border border-red-200 text-red-500 font-bold text-[14px] bg-white active:bg-red-50 transition-colors shadow-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
