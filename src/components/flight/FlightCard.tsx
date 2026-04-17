import { parseDatetime, remarkColor, type Flight } from '../../services/flightApi'

export default function FlightCard({ f }: { f: Flight }) {
  const sched   = parseDatetime(f.scheduleDatetime)
  const est     = parseDatetime(f.estimatedDatetime)
  const delayed = f.scheduleDatetime !== f.estimatedDatetime
  const badgeCls = remarkColor(f.remark)

  return (
    <div className="bg-white border border-brand-border rounded-xl px-4 py-3.5 hover:border-brand-green transition-colors cursor-pointer">
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
          <span className={delayed ? 'line-through mr-1' : 'font-semibold text-brand-ink'}>{sched.time}</span>
          {delayed && <span className="font-semibold text-brand-red">{est.time}</span>}
        </span>
        <span>{f.terminalId} · {f.gateNumber}게이트</span>
      </div>
    </div>
  )
}
