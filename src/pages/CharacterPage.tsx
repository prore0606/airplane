import TopNav from '../components/layout/TopNav'

const BADGES = [
  { icon: '✈️', name: '첫 비행',   earned: true },
  { icon: '🏆', name: '10회 여행', earned: true },
  { icon: '⏱️', name: '시간 달인', earned: true },
  { icon: '🧳', name: '짐 마스터', earned: false },
  { icon: '🛋️', name: '라운지킹', earned: false },
  { icon: '🗺️', name: '탐험가',   earned: false },
]

export default function CharacterPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <TopNav />

      <div className="px-4 pt-3 pb-2">
        <p className="text-base font-bold text-brand-black">내 캐릭터</p>
      </div>

      {/* 캐릭터 메인 */}
      <div className="mx-4 mb-3 rounded-hero p-6 relative overflow-hidden flex flex-col items-center"
        style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
        <div className="absolute -bottom-1/3 -right-4 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-pale to-brand-mid flex items-center justify-center text-4xl mb-3">
          🦅
        </div>
        <p className="font-display font-black text-lg text-white tracking-tight">공항 탐험가</p>
        <p className="text-[11px] text-white/45 mt-0.5">Lv. 7</p>
        <div className="w-full mt-4">
          <div className="h-2 bg-white/10 rounded-pill overflow-hidden">
            <div className="h-full bg-brand-green rounded-pill" style={{ width: '72%' }} />
          </div>
          <p className="text-[10px] text-white/35 mt-1.5 text-center">다음 레벨까지 280 XP</p>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-2 mx-4 mb-4">
        {[{ val: '12', label: '총 여행' }, { val: '4.8k', label: '걸음수' }, { val: '1,240', label: 'XP' }].map(({ val, label }) => (
          <div key={label} className="bg-white rounded-card border border-brand-border p-3 text-center">
            <p className="font-display font-black text-xl text-brand-green">{val}</p>
            <p className="text-[10px] text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* 배지 */}
      <div className="flex items-center justify-between px-4 mb-2">
        <p className="text-[13px] font-bold text-brand-black">획득 배지</p>
        <span className="text-[11px] text-brand-muted">3 / 6</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mx-4">
        {BADGES.map((b) => (
          <div key={b.name}
            className={`rounded-card border p-3 flex flex-col items-center gap-1 ${b.earned ? 'bg-white border-brand-border' : 'bg-brand-surface border-brand-border opacity-40'}`}>
            <span className="text-2xl">{b.icon}</span>
            <span className="text-[10px] text-brand-muted text-center leading-tight">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
