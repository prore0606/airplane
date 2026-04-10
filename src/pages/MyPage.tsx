import TopNav from '../components/layout/TopNav'
import { useAuth } from '../context/AuthContext'

const BADGES = [
  { icon: '📸', label: '첫 스캔',   desc: '항공권 최초 등록', earned: true  },
  { icon: '📋', label: '준비완료',  desc: '체크리스트 100%', earned: true  },
  { icon: '🅿️', label: '주차마스터', desc: 'GPS 위치 저장',  earned: true  },
  { icon: '🚶', label: '만보왕',    desc: '10,000보 달성',   earned: false },
  { icon: '🛍️', label: '면세탐험가', desc: '면세구역 입장',  earned: false },
  { icon: '✈️', label: '여행완료',  desc: '첫 여행 완주',   earned: false },
]

const MENU = [
  { icon: '✈️', label: '내 여행 기록' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '📔', label: '여권 · 서류 관리' },
  { icon: '👫', label: '친구 위치 공유' },
  { icon: '⚙️', label: '앱 설정' },
]

const STEPS_TODAY = 4820
const STEPS_GOAL  = 10000
const DISTANCE_KM = 3.4
const CALORIES    = 180

// ── 프로필 화면 ──────────────────────────────────
function ProfileScreen() {
  const { user, signOut } = useAuth()

  const name    = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '여행자'
  const avatar  = user?.user_metadata?.avatar_url as string | undefined
  const email   = user?.email ?? ''
  const stepsPct = Math.round((STEPS_TODAY / STEPS_GOAL) * 100)

  return (
    <div className="space-y-6">
      <p className="text-xl font-bold text-brand-black">MY</p>

      <div className="grid grid-cols-2 gap-4">

        {/* 왼쪽 */}
        <div className="space-y-4">

          {/* 프로필 카드 */}
          <div className="rounded-hero p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
            <div className="absolute -bottom-1/3 -right-4 w-36 h-36 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />

            {/* 아바타 */}
            {avatar ? (
              <img src={avatar} alt={name}
                className="w-12 h-12 rounded-2xl object-cover mb-4 border-2 border-brand-green/30" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-[#00c48c] flex items-center justify-center text-2xl mb-4">
                🧑‍💼
              </div>
            )}

            <p className="text-lg font-bold text-white leading-tight">{name}</p>
            <p className="text-[11px] text-white/45 mt-0.5 truncate">{email}</p>

            <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.08]">
              <div>
                <p className="font-display font-black text-xl text-brand-green">0</p>
                <p className="text-[10px] text-white/35 mt-0.5">총 여행</p>
              </div>
              <div>
                <p className="font-display font-black text-xl text-brand-green">Lv.1</p>
                <p className="text-[10px] text-white/35 mt-0.5">레벨</p>
              </div>
              <div>
                <p className="font-display font-black text-xl text-brand-green">0</p>
                <p className="text-[10px] text-white/35 mt-0.5">배지</p>
              </div>
            </div>
          </div>

          {/* 만보기 */}
          <div className="bg-white border border-brand-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold text-brand-black text-sm">오늘 걸음수</p>
              <span className="text-[10px] text-brand-green font-bold bg-brand-pale px-2 py-0.5 rounded-pill">공항 내</span>
            </div>
            <p className="font-display font-black text-3xl text-brand-black">
              {STEPS_TODAY.toLocaleString()}
              <span className="text-sm font-sans font-normal text-brand-muted ml-1">보</span>
            </p>
            <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden">
              <div className="h-full bg-brand-green rounded-pill" style={{ width: `${stepsPct}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-brand-surface rounded-xl p-2.5 text-center">
                <p className="font-bold text-brand-black text-sm">{DISTANCE_KM}km</p>
                <p className="text-[10px] text-brand-muted mt-0.5">이동 거리</p>
              </div>
              <div className="bg-brand-surface rounded-xl p-2.5 text-center">
                <p className="font-bold text-brand-black text-sm">{CALORIES}kcal</p>
                <p className="text-[10px] text-brand-muted mt-0.5">소모 칼로리</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="space-y-4">

          {/* 배지 */}
          <div className="bg-white border border-brand-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-brand-black text-sm">배지</p>
              <span className="text-xs text-brand-muted">0 / {BADGES.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {BADGES.map((b) => (
                <div key={b.label}
                  className="rounded-xl p-2 flex flex-col items-center gap-1 border border-brand-border bg-brand-surface opacity-40 grayscale">
                  <span className="text-xl">{b.icon}</span>
                  <p className="text-[9px] font-bold text-brand-ink text-center leading-tight">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 메뉴 */}
          <div className="space-y-2">
            {MENU.map((item) => (
              <button key={item.label}
                className="bg-white border border-brand-border rounded-xl px-3 py-3 flex items-center gap-2.5 w-full text-left hover:border-brand-green transition-colors">
                <div className="w-7 h-7 rounded-lg bg-brand-pale flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <span className="flex-1 font-semibold text-brand-ink text-xs">{item.label}</span>
                <span className="text-brand-muted text-sm">›</span>
              </button>
            ))}

            {/* 로그아웃 */}
            <button
              onClick={signOut}
              className="bg-white border border-brand-border rounded-xl px-3 py-3 flex items-center gap-2.5 w-full text-left hover:border-red-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-sm flex-shrink-0">
                🚪
              </div>
              <span className="flex-1 font-semibold text-red-500 text-xs">로그아웃</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── 메인 ────────────────────────────────────────
export default function MyPage() {
  const { loading } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ProfileScreen />
          )}
        </div>
      </div>
    </div>
  )
}
