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
    <div className="flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <TopNav showNotifDot />

      {/* 인사말 */}
      <div className="px-5 py-3">
        <p className="text-[11px] text-brand-muted">안녕하세요 👋</p>
        <p className="text-base font-bold text-brand-black mt-0.5">
          D-2 출국 준비됐나요?
        </p>
      </div>

      {/* 항공편 히어로 카드 */}
      <div className="mx-4 mb-3 rounded-hero p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2a1e 100%)' }}>
        <div className="absolute -top-1/3 -right-4 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.25), transparent 65%)' }} />
        <div className="inline-flex items-center gap-1 bg-brand-green/20 border border-brand-green/30 text-brand-green text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-pill mb-3">
          ✈ 실시간 연동
        </div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="font-display font-black text-[26px] text-white tracking-tight">ICN</span>
          <span className="text-brand-green text-lg">→</span>
          <span className="font-display font-black text-[26px] text-white tracking-tight">NRT</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[12px] text-white/50 mb-0.5">KE 723 · 대한항공</p>
            <p className="text-xl font-bold text-white">13:40 출발</p>
          </div>
          <span className="bg-brand-green text-white text-[10px] font-bold px-2.5 py-1 rounded-[8px] tracking-wider">G게이트</span>
        </div>
        <div className="mt-3 bg-white/[0.07] rounded-[10px] px-3.5 py-2.5 flex justify-between items-center">
          <span className="text-[10px] text-white/40">수하물 마감까지</span>
          <span className="text-[13px] font-bold text-brand-green">⏱ 2시간 20분</span>
        </div>
      </div>

      {/* 미니 카드 2열 */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-3">
        <div className="bg-white rounded-card border border-brand-border p-3.5">
          <p className="text-[9px] text-brand-muted font-semibold uppercase tracking-wider mb-1.5">보안검색 대기</p>
          <p className="text-base font-bold text-brand-black">3번 라인</p>
          <p className="text-[10px] text-brand-muted mt-0.5">대기 약 5분 · 가장 빠름</p>
        </div>
        <div className="bg-brand-green rounded-card p-3.5">
          <p className="text-[9px] text-white/65 font-semibold uppercase tracking-wider mb-1.5">내 차 위치</p>
          <p className="text-base font-bold text-white">A구역 3층</p>
          <p className="text-[10px] text-white/60 mt-0.5">저장 완료 · 안내 준비</p>
        </div>
      </div>

      {/* 공항 시설 */}
      <div className="flex items-center justify-between px-4 mb-2">
        <p className="text-[13px] font-bold text-brand-black">공항 내 시설</p>
        <button className="text-[11px] text-brand-green font-semibold">전체보기 ›</button>
      </div>
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-1">
        {FACILITIES.map((f) => (
          <button key={f.name}
            className="flex-shrink-0 bg-white border border-brand-border rounded-xl px-3 py-2.5 flex flex-col items-center gap-1 min-w-[56px]">
            <span className="text-lg">{f.icon}</span>
            <span className="text-[9px] text-brand-muted font-medium whitespace-nowrap">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
