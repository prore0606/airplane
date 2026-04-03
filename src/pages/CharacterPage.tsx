import TopNav from '../components/layout/TopNav'

const BADGES = [
  { icon: '✈️', name: '첫 비행',   earned: true },
  { icon: '🏆', name: '10회 여행', earned: true },
  { icon: '⏱️', name: '시간 달인', earned: true },
  { icon: '🧳', name: '짐 마스터', earned: false },
  { icon: '🛋️', name: '라운지킹', earned: false },
  { icon: '🗺️', name: '탐험가',   earned: false },
]

const STATS = [
  { val: '12',   label: '총 여행' },
  { val: '4.8k', label: '걸음수' },
  { val: '1,240',label: 'XP' },
]

export default function CharacterPage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <p className="text-xl font-bold text-brand-black">내 캐릭터</p>

          <div className="grid grid-cols-2 gap-6">
            {/* 캐릭터 카드 */}
            <div className="rounded-hero p-8 relative overflow-hidden flex flex-col items-center"
              style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}>
              <div className="absolute -bottom-1/3 -right-4 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-pale to-brand-mid flex items-center justify-center text-5xl mb-4">
                🦅
              </div>
              <p className="font-display font-black text-xl text-white tracking-tight">공항 탐험가</p>
              <p className="text-xs text-white/45 mt-1">Lv. 7</p>
              <div className="w-full mt-5">
                <div className="h-2 bg-white/10 rounded-pill overflow-hidden">
                  <div className="h-full bg-brand-green rounded-pill" style={{ width: '72%' }} />
                </div>
                <p className="text-xs text-white/35 mt-2 text-center">다음 레벨까지 280 XP</p>
              </div>
            </div>

            {/* 오른쪽: 통계 + 배지 */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {STATS.map(({ val, label }) => (
                  <div key={label} className="bg-white rounded-card border border-brand-border p-4 text-center">
                    <p className="font-display font-black text-2xl text-brand-green">{val}</p>
                    <p className="text-xs text-brand-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-brand-black">획득 배지</p>
                  <span className="text-sm text-brand-muted">3 / 6</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BADGES.map((b) => (
                    <div key={b.name}
                      className={`rounded-card border p-3 flex flex-col items-center gap-2 ${b.earned ? 'bg-white border-brand-border' : 'bg-brand-surface border-brand-border opacity-40'}`}>
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-[11px] text-brand-muted text-center">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
