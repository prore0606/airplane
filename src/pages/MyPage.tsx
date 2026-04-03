import TopNav from '../components/layout/TopNav'

const MENU = [
  { icon: '✈️', label: '내 여행 기록' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '📔', label: '여권 · 서류 관리' },
  { icon: '🤝', label: '친구 이동' },
]

const STATS = [
  { val: '12',   label: '총 여행' },
  { val: '4.8k', label: '걸음수' },
  { val: 'Lv.7', label: '캐릭터' },
]

export default function MyPage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <p className="text-xl font-bold text-brand-black">마이페이지</p>

          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 프로필 */}
            <div className="space-y-4">
              <div className="rounded-hero p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
                <div className="absolute -bottom-1/3 -right-4 w-36 h-36 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-[#00c48c] flex items-center justify-center text-2xl mb-4">
                  🧑‍💼
                </div>
                <p className="text-xl font-bold text-white">김민준</p>
                <p className="text-xs text-white/45 mt-0.5">PRO 멤버 · 가입 3개월</p>
                <div className="flex gap-6 mt-5 pt-4 border-t border-white/[0.08]">
                  {STATS.map(({ val, label }) => (
                    <div key={label}>
                      <p className="font-display font-black text-xl text-brand-green">{val}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 캐릭터 미니 */}
              <div className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-pale to-brand-mid flex items-center justify-center text-3xl flex-shrink-0">
                  🦅
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-black text-sm mb-1.5">공항 탐험가 Lv.7</p>
                  <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden mb-1">
                    <div className="h-full bg-brand-green rounded-pill" style={{ width: '72%' }} />
                  </div>
                  <p className="text-xs text-brand-muted">다음 레벨까지 280 XP</p>
                </div>
              </div>
            </div>

            {/* 오른쪽: 메뉴 */}
            <div>
              <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">메뉴</p>
              <div className="space-y-2">
                {MENU.map((item) => (
                  <button key={item.label}
                    className="bg-white border border-brand-border rounded-xl px-5 py-4 flex items-center gap-3 w-full text-left hover:border-brand-green transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-brand-pale flex items-center justify-center text-base flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="flex-1 font-semibold text-brand-ink">{item.label}</span>
                    <span className="text-brand-muted">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
