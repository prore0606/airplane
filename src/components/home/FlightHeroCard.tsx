import type { Flight } from '../../services/flightApi'
import { parseDatetime } from '../../services/flightApi'

interface Props {
  flight: Flight | null
  loading: boolean
}

export default function FlightHeroCard({ flight, loading }: Props) {
  const sched = flight ? parseDatetime(flight.scheduleDatetime) : null
  const est   = flight ? parseDatetime(flight.estimatedDatetime) : null
  const delayed = flight && flight.scheduleDatetime !== flight.estimatedDatetime

  return (
    <div className="rounded-hero p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2a1e 100%)' }}>
      <div className="absolute -top-1/3 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />

      <div className="inline-flex items-center gap-1.5 bg-brand-green/20 border border-brand-green/30 text-brand-green text-[10px] font-bold tracking-widest px-3 py-1 rounded-pill mb-4">
        {loading ? '⏳ 로딩 중' : '✈ 실시간 연동'}
      </div>

      {loading || !flight ? (
        <p className="text-white/50 text-sm animate-pulse py-4">항공편 정보를 불러오는 중...</p>
      ) : (
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-display font-black text-4xl text-white tracking-tight">ICN</span>
              <span className="text-brand-green text-2xl">→</span>
              <span className="font-display font-black text-4xl text-white tracking-tight">{flight.airportCode}</span>
            </div>
            <p className="text-sm text-white/50 mb-1">{flight.flightId} · {flight.airline}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${delayed ? 'text-white/40 line-through text-lg' : 'text-white'}`}>
                {sched?.time} 출발
              </p>
              {delayed && <p className="text-xl font-bold text-brand-red">{est?.time} 출발</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-[8px] tracking-wider">
              {flight.gateNumber}게이트
            </span>
            <div className="bg-white/[0.07] rounded-xl px-4 py-2.5 text-right">
              <p className="text-[10px] text-white/40 mb-0.5">상태</p>
              <p className="text-sm font-bold text-brand-green">{flight.remark}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
