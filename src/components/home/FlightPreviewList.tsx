import type { Flight } from '../../services/flightApi'
import { parseDatetime } from '../../services/flightApi'

interface Props {
  flights: Flight[]
}

export default function FlightPreviewList({ flights }: Props) {
  if (flights.length <= 1) return null
  const rest = flights.slice(1, 4)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-brand-black">다른 출발편</p>
        <span className="text-xs text-brand-muted">{flights.length}편 운항 중</span>
      </div>
      <div className="space-y-2">
        {rest.map((f) => {
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
  )
}
