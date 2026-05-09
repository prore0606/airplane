import { useAuth } from '../../../context/AuthContext'
import { useUserMode } from '../../../context/UserModeContext'
import LanguageSelector from './LanguageSelector'

export default function ForeignerMyPage() {
  const { user, signOut } = useAuth()
  const { resetMode } = useUserMode()
  const name  = user?.user_metadata?.full_name  ?? 'Traveler'
  const email = user?.email ?? ''

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

          {/* 유저 카드 */}
          <div className="bg-white rounded-2xl p-4 border border-brand-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-pale flex items-center justify-center text-2xl shrink-0">
              👤
            </div>
            <div className="min-w-0">
              <p className="font-bold text-brand-black truncate">{name}</p>
              <p className="text-[12px] text-brand-muted truncate">{email}</p>
            </div>
          </div>

          <LanguageSelector />

          {/* 모드 전환 */}
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
            <button
              onClick={resetMode}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-brand-pale transition-colors"
            >
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

          {/* 로그아웃 */}
          <button
            onClick={signOut}
            className="w-full py-4 rounded-2xl border border-red-200 text-red-500 font-bold text-[14px] hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>

        </div>
      </div>
    </div>
  )
}
