import TopNav from '../components/layout/TopNav'
import { useFlights } from '../hooks/useFlights'
import { parseDatetime } from '../services/flightApi'
import { useCongestion } from '../hooks/useCongestion'
import { congestionColor } from '../services/congestionApi'

const FACILITIES = [
  { icon: '🍽️', name: '식당' },
  { icon: '🛍️', name: '면세점' },
  { icon: '🛋️', name: '라운지' },
  { icon: '📱', name: '환전' },
  { icon: '🏧', name: 'ATM' },
  { icon: '💊', name: '약국' },
]

export default function HomePage() {
  const { flights, loading } = useFlights()
  const { data: congestion } = useCongestion()
  const fastest = congestion.reduce<typeof congestion[0] | null>((a, b) =>
    !a || Number(b.wait_time) < Number(a.wait_time) ? b : a, null)
  const next = flights[0]
  const sched = next ? parseDatetime(next.scheduleDatetime) : null
  const est = next ? parseDatetime(next.estimatedDatetime) : null
  const delayed = next && next.scheduleDatetime !== next.estimatedDatetime

  return (
    <div className="flex flex-col h-full">
      <TopNav showNotifDot />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          {/* 인사말 */}
          <div>
            <p className="text-sm text-brand-muted">안녕하세요 👋</p>
            <p className="text-xl font-bold text-brand-black mt-1">
              {next ? `${next.airport} 출발 준비됐나요?` : 'D-2 출국 준비됐나요?'}
            </p>
          </div>

          {/* 항공편 히어로 카드 */}
          <div className="rounded-hero p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2a1e 100%)' }}>
            <div className="absolute -top-1/3 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
            <div className="inline-flex items-center gap-1.5 bg-brand-green/20 border border-brand-green/30 text-brand-green text-[10px] font-bold tracking-widest px-3 py-1 rounded-pill mb-4">
              {loading ? '⏳ 로딩 중' : '✈ 실시간 연동'}
            </div>

            {loading || !next ? (
              <div className="py-4">
                <p className="text-white/50 text-sm animate-pulse">항공편 정보를 불러오는 중...</p>
              </div>
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display font-black text-4xl text-white tracking-tight">ICN</span>
                    <span className="text-brand-green text-2xl">→</span>
                    <span className="font-display font-black text-4xl text-white tracking-tight">{next.airportCode}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-1">{next.flightId} · {next.airline}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold ${delayed ? 'text-white/40 line-through text-lg' : 'text-white'}`}>
                      {sched?.time} 출발
                    </p>
                    {delayed && (
                      <p className="text-xl font-bold text-brand-red">{est?.time} 출발</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-[8px] tracking-wider">
                    {next.gateNumber}게이트
                  </span>
                  <div className="bg-white/[0.07] rounded-xl px-4 py-2.5 text-right">
                    <p className="text-[10px] text-white/40 mb-0.5">상태</p>
                    <p className="text-sm font-bold text-brand-green">{next.remark}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 미니 카드 2열 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 보안검색 혼잡도 */}
            <div className="bg-white rounded-card border border-brand-border p-5">
              <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider mb-2">보안검색 추천 라인</p>
              {fastest ? (
                <>
                  <p className="text-xl font-bold text-brand-black">{fastest.line_number}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill ${congestionColor(fastest.congestion)}`}>
                      {fastest.congestion}
                    </span>
                    <span className="text-xs text-brand-muted">대기 {fastest.wait_time}분</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-brand-muted animate-pulse">로딩 중...</p>
              )}
            </div>
            <div className="bg-brand-green rounded-card p-5">
              <p className="text-[10px] text-white/65 font-semibold uppercase tracking-wider mb-2">내 차 위치</p>
              <p className="text-xl font-bold text-white">A구역 3층</p>
              <p className="text-xs text-white/60 mt-1">저장 완료 · 안내 준비</p>
            </div>
          </div>

          {/* 출국장 전체 혼잡도 */}
          {congestion.length > 0 && (
            <div>
              <p className="font-bold text-brand-black mb-3">출국장 라인별 혼잡도</p>
              <div className="grid grid-cols-5 gap-2">
                {congestion.map((c) => (
                  <div key={c.line_number} className="bg-white border border-brand-border rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-brand-black mb-1">{c.line_number.replace('번 라인', '')}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-pill block ${congestionColor(c.congestion)}`}>
                      {c.congestion}
                    </span>
                    <p className="text-[10px] text-brand-muted mt-1">{c.wait_time}분</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다음 편 미리보기 */}
          {!loading && flights.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-brand-black">다른 출발편</p>
                <span className="text-xs text-brand-muted">{flights.length}편 운항 중</span>
              </div>
              <div className="space-y-2">
                {flights.slice(1, 4).map((f) => {
                  const t = parseDatetime(f.scheduleDatetime)
                  return (
                    <div key={f.flightId}
                      className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-brand-green transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-sm text-brand-black">{f.flightId}</span>
                        <span className="text-xs text-brand-muted">{f.airportCode} · {f.airline}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-brand-ink font-semibold">{t.time}</span>
                        <span className="text-brand-muted">{f.gateNumber}게이트</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

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
