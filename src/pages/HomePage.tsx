import TopNav from '../components/layout/TopNav'

const FACILITIES = [
  { icon: '🍽️', name: '식당' },
  { icon: '🛍️', name: '면세점' },
  { icon: '🛋️', name: '라운지' },
  { icon: '📱', name: '환전' },
  { icon: '🏧', name: 'ATM' },
  { icon: '💊', name: '약국' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav showNotifDot />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          {/* 인사말 */}
          <div>
            <p className="text-sm text-brand-muted">안녕하세요 👋</p>
            <p className="text-xl font-bold text-brand-black mt-1">
              D-2 출국 준비됐나요?
            </p>
          </div>

          {/* 항공편 히어로 카드 */}
          <div className="rounded-hero p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2a1e 100%)' }}>
            <div className="absolute -top-1/3 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
            <div className="inline-flex items-center gap-1.5 bg-brand-green/20 border border-brand-green/30 text-brand-green text-[10px] font-bold tracking-widest px-3 py-1 rounded-pill mb-4">
              ✈ 실시간 연동
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display font-black text-4xl text-white tracking-tight">ICN</span>
                  <span className="text-brand-green text-2xl">→</span>
                  <span className="font-display font-black text-4xl text-white tracking-tight">NRT</span>
                </div>
                <p className="text-sm text-white/50 mb-1">KE 723 · 대한항공</p>
                <p className="text-2xl font-bold text-white">13:40 출발</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-[8px] tracking-wider">G게이트</span>
                <div className="bg-white/[0.07] rounded-xl px-4 py-2.5 text-right">
                  <p className="text-[10px] text-white/40 mb-0.5">수하물 마감까지</p>
                  <p className="text-sm font-bold text-brand-green">⏱ 2시간 20분</p>
                </div>
              </div>
            </div>
          </div>

          {/* 미니 카드 2열 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-card border border-brand-border p-5">
              <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider mb-2">보안검색 대기</p>
              <p className="text-xl font-bold text-brand-black">3번 라인</p>
              <p className="text-xs text-brand-muted mt-1">대기 약 5분 · 가장 빠름</p>
            </div>
            <div className="bg-brand-green rounded-card p-5">
              <p className="text-[10px] text-white/65 font-semibold uppercase tracking-wider mb-2">내 차 위치</p>
              <p className="text-xl font-bold text-white">A구역 3층</p>
              <p className="text-xs text-white/60 mt-1">저장 완료 · 안내 준비</p>
            </div>
          </div>

          {/* 공항 시설 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-brand-black">공항 내 시설</p>
              <button className="text-sm text-brand-green font-semibold">전체보기 ›</button>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {FACILITIES.map((f) => (
                <button key={f.name}
                  className="bg-white border border-brand-border rounded-xl py-4 flex flex-col items-center gap-2 hover:border-brand-green transition-colors">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-[11px] text-brand-muted font-medium">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
