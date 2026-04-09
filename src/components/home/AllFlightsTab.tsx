import { useState } from 'react'
import { parseDatetime, remarkColor, type Flight } from '../../services/flightApi'

interface Props {
  flights: Flight[]
  loading: boolean
  lastUpdated: Date | null
  onRefetch: () => void
}

export default function AllFlightsTab({ flights, loading, lastUpdated, onRefetch }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? flights.filter((f) =>
        f.flightId.toLowerCase().includes(search.toLowerCase()) ||
        f.airportCode.toLowerCase().includes(search.toLowerCase()) ||
        f.airline.includes(search)
      )
    : flights

  const timeLabel = lastUpdated
    ? `${lastUpdated.getHours().toString().padStart(2, '0')}:${lastUpdated.getMinutes().toString().padStart(2, '0')} 기준`
    : null

  return (
    <div className="space-y-4">

      {/* 검색 + 새로고침 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="편명·목적지·항공사 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-muted focus:outline-none focus:border-brand-green"
        />
        <button
          onClick={onRefetch}
          disabled={loading}
          className="text-xs text-brand-green font-semibold bg-white border border-brand-border rounded-xl px-3 py-2.5 disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? '조회 중...' : '🔄 새로고침'}
        </button>
      </div>

      {/* 조회 시각 + 편수 */}
      <div className="flex items-center justify-between text-[11px] text-brand-muted">
        <span>{filtered.length}편 표시 중</span>
        {timeLabel && <span>{timeLabel}</span>}
      </div>

      {/* 로딩 스켈레톤 */}
      {loading && flights.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      )}

      {/* 항공편 목록 */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-sm text-brand-muted py-8">검색 결과가 없습니다</p>
      )}

      <div className="space-y-2">
        {filtered.map((f) => {
          const sched = parseDatetime(f.scheduleDatetime)
          const est = parseDatetime(f.estimatedDatetime)
          const delayed = f.scheduleDatetime !== f.estimatedDatetime
          const badgeCls = remarkColor(f.remark)

          return (
            <div key={f.flightId}
              className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-brand-green transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-brand-black">{f.flightId}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-pill ${badgeCls}`}>{f.remark}</span>
                  </div>
                  <span className="text-xs text-brand-muted">{f.airportCode} · {f.airline}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className={`text-sm font-bold ${delayed ? 'text-brand-muted line-through text-xs' : 'text-brand-black'}`}>
                    {sched.time}
                  </span>
                  {delayed && <span className="text-sm font-bold text-brand-red">{est.time}</span>}
                </div>
                <span className="text-xs text-brand-muted">{f.gateNumber}게이트</span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
