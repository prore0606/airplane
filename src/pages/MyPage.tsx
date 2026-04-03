import TopNav from '../components/layout/TopNav'

const MENU = [
  { icon: '✈️', label: '내 여행 기록' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '📔', label: '여권 · 서류 관리' },
  { icon: '🤝', label: '친구 이동' },
]

export default function MyPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <TopNav />

      {/* 프로필 카드 */}
      <div className="mx-4 mt-3 mb-3 rounded-hero p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
        <div className="absolute -bottom-1/3 -right-4 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-[#00c48c] flex items-center justify-center text-2xl mb-3">
          🧑‍💼
        </div>
        <p className="text-lg font-bold text-white">김민준</p>
        <p className="text-[11px] text-white/45 mt-0.5">PRO 멤버 · 가입 3개월</p>
        <div className="flex gap-5 mt-4 pt-4 border-t border-white/[0.08]">
          {[{ val: '12', label: '총 여행' }, { val: '4.8k', label: '걸음수' }, { val: 'Lv.7', label: '캐릭터' }].map(({ val, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-display font-black text-lg text-brand-green">{val}</span>
              <span className="text-[10px] text-white/35">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 캐릭터 미니 */}
      <div className="mx-4 mb-3 bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-pale to-brand-mid flex items-center justify-center text-3xl flex-shrink-0">
          🦅
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-brand-black mb-1">공항 탐험가 Lv.7</p>
          <div className="h-1.5 bg-brand-border rounded-pill overflow-hidden mb-1">
            <div className="h-full bg-brand-green rounded-pill" style={{ width: '72%' }} />
          </div>
          <p className="text-[10px] text-brand-muted">다음 레벨까지 280 XP</p>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="px-4 flex flex-col gap-2">
        {MENU.map((item) => (
          <button key={item.label}
            className="bg-white border border-brand-border rounded-xl px-4 py-3.5 flex items-center gap-3 w-full text-left">
            <div className="w-8 h-8 rounded-[10px] bg-brand-pale flex items-center justify-center text-[15px] flex-shrink-0">
              {item.icon}
            </div>
            <span className="flex-1 text-[13px] font-semibold text-brand-ink">{item.label}</span>
            <span className="text-brand-muted text-sm">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
