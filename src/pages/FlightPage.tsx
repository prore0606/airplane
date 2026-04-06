import TopNav from '../components/layout/TopNav'
import { useFlights } from '../hooks/useFlights'
import { parseDatetime, remarkColor } from '../services/flightApi'

const SCAN_OPTIONS = [
  { icon: '🖼️', label: '갤러리에서' },
  { icon: '💬', label: '카카오톡에서' },
  { icon: '📧', label: '이메일에서' },
  { icon: '📄', label: 'PDF 파일' },
]

export default function FlightPage() {
  const { flights, loading, error } = useFlights()

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">항공권 등록 · 실시간 운항</p>
            <p className="text-sm text-brand-muted mt-1">스캔하면 모든 여행 정보가 자동 연결됩니다</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 스캔 영역 */}
            <div className="space-y-4">
              <div className="bg-brand-pale border-2 border-dashed border-brand-mid rounded-hero px-8 py-10 text-center">
                <div className="text-5xl mb-4">📸</div>
                <p className="font-bold text-brand-black mb-2">항공권 사진을 올려주세요</p>
                <p className="text-sm text-brand-muted leading-relaxed">
                  AI가 자동으로 항공편 정보를<br />읽어서 등록해드립니다
                </p>
              </div>
              <button className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors">
                📷 카메라로 촬영하기
              </button>
              <div className="grid grid-cols-2 gap-2">
                {SCAN_OPTIONS.map((opt) => (
                  <button key={opt.label}
                    className="bg-white border border-brand-border rounded-xl p-3.5 flex items-center gap-2.5 hover:border-brand-green transition-colors">
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-semibold text-brand-ink">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: 실시간 출발 현황 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">실시간 출발 현황</p>
                {!loading && !error && (
                  <span className="text-[10px] text-brand-green font-semibold bg-brand-pale px-2 py-0.5 rounded-pill">
                    ● LIVE
                  </span>
                )}
              </div>

              {loading && (
                <div className="bg-white border border-brand-border rounded-xl p-6 text-center">
                  <div className="text-2xl mb-2 animate-pulse">✈️</div>
                  <p className="text-sm text-brand-muted">운항 정보 로딩 중...</p>
                </div>
              )}

              {error && !loading && (
                <div className="bg-white border border-brand-border rounded-xl p-4">
                  <p className="text-xs text-brand-muted text-center">샘플 데이터로 표시 중</p>
                </div>
              )}

              {!loading && flights.map((f) => {
                const sched = parseDatetime(f.scheduleDatetime)
                const est = parseDatetime(f.estimatedDatetime)
                const delayed = f.scheduleDatetime !== f.estimatedDatetime
                const badgeCls = remarkColor(f.remark)

                return (
                  <div key={f.flightId}
                    className="bg-white border border-brand-border rounded-xl px-4 py-3.5 hover:border-brand-green transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-black text-sm text-brand-black">{f.flightId}</span>
                          <span className="text-xs text-brand-muted truncate">{f.airline}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                          <span>ICN</span>
                          <span className="text-brand-green text-xs">→</span>
                          <span>{f.airportCode}</span>
                          <span className="text-brand-muted font-normal text-xs ml-1">{f.airport}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill shrink-0 ${badgeCls}`}>
                        {f.remark}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-brand-border text-xs text-brand-muted">
                      <span>
                        출발{' '}
                        <span className={delayed ? 'line-through mr-1' : 'font-semibold text-brand-ink'}>
                          {sched.time}
                        </span>
                        {delayed && <span className="font-semibold text-brand-red">{est.time}</span>}
                      </span>
                      <span>{f.terminalId} · {f.gateNumber}게이트</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
