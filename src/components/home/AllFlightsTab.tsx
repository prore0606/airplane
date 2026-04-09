import { useState } from 'react'
import { parseDatetime, remarkColor, type Flight } from '../../services/flightApi'

interface Props {
  flights: Flight[]
  loading: boolean
  lastUpdated: Date | null
  onRefetch: () => void
}

type Terminal = 'all' | 'T1' | 'T2'
type TimeSlot  = 'all' | 'dawn' | 'morning' | 'afternoon' | 'evening'

const TIME_SLOTS: { id: TimeSlot; label: string; range: [number, number] }[] = [
  { id: 'all',       label: '전체',       range: [0,  24] },
  { id: 'dawn',      label: '새벽 ~06시', range: [0,   6] },
  { id: 'morning',   label: '오전 06~12', range: [6,  12] },
  { id: 'afternoon', label: '오후 12~18', range: [12, 18] },
  { id: 'evening',   label: '저녁 18~',  range: [18, 24] },
]

function getHour(raw: string) {
  // HHMM("0830") 또는 YYYYMMDDHHMMSS("20260409083000") 모두 처리
  if (raw.length <= 4) return parseInt(raw.slice(0, 2), 10)
  return parseInt(raw.slice(8, 10), 10)
}

export default function AllFlightsTab({ flights, loading, lastUpdated, onRefetch }: Props) {
  const [search,   setSearch]   = useState('')
  const [terminal, setTerminal] = useState<Terminal>('all')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('all')

  const slot = TIME_SLOTS.find((s) => s.id === timeSlot)!

  const filtered = flights.filter((f) => {
    const hour = getHour(f.scheduleDatetime)
    const inTime = timeSlot === 'all' || (hour >= slot.range[0] && hour < slot.range[1])
    const inTerminal = terminal === 'all' || f.terminalId === terminal
    const q = search.trim().toLowerCase()
    const inSearch = !q || (
      f.flightId.toLowerCase().includes(q) ||
      f.airportCode.toLowerCase().includes(q) ||
      f.airport.includes(search.trim()) ||
      f.airline.includes(search.trim())
    )
    return inTime && inTerminal && inSearch
  })

  const timeLabel = lastUpdated
    ? `${lastUpdated.getHours().toString().padStart(2, '0')}:${lastUpdated.getMinutes().toString().padStart(2, '0')} 기준`
    : null

  return (
    <div className="space-y-4">

      {/* 검색 + 새로고침 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="편명 · 목적지 · 항공사 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-muted focus:outline-none focus:border-brand-green"
        />
        <button
          onClick={onRefetch}
          disabled={loading}
          className="shrink-0 text-xs text-brand-green font-semibold bg-white border border-brand-border rounded-xl px-3 py-2.5 disabled:opacity-40 hover:border-brand-green transition-colors"
        >
          {loading ? '조회 중...' : '🔄 새로고침'}
        </button>
      </div>

      {/* 터미널 필터 */}
      <div className="flex items-center gap-2">
        {(['all', 'T1', 'T2'] as Terminal[]).map((t) => (
          <button
            key={t}
            onClick={() => setTerminal(t)}
            className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-colors ${
              terminal === t
                ? 'bg-brand-green text-white'
                : 'bg-white border border-brand-border text-brand-muted hover:border-brand-green hover:text-brand-black'
            }`}
          >
            {t === 'all' ? '전체 터미널' : t}
          </button>
        ))}
      </div>

      {/* 시간대 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        {TIME_SLOTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setTimeSlot(s.id)}
            className={`px-3 py-1.5 rounded-pill text-xs font-semibold transition-colors ${
              timeSlot === s.id
                ? 'bg-brand-black text-white'
                : 'bg-white border border-brand-border text-brand-muted hover:border-brand-green hover:text-brand-black'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 결과 수 + 조회 시각 */}
      <div className="flex items-center justify-between text-[11px] text-brand-muted">
        <span>{filtered.length}편</span>
        {timeLabel && <span>{timeLabel}</span>}
      </div>

      {/* 로딩 스켈레톤 */}
      {loading && flights.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-xl h-[72px] animate-pulse" />
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm text-brand-muted">해당하는 항공편이 없습니다</p>
        </div>
      )}

      {/* 항공편 목록 */}
      <div className="space-y-2">
        {filtered.map((f) => {
          const sched   = parseDatetime(f.scheduleDatetime)
          const est     = parseDatetime(f.estimatedDatetime)
          const delayed = f.scheduleDatetime !== f.estimatedDatetime
          const badgeCls = remarkColor(f.remark)

          return (
            <div
              key={f.flightId}
              className="bg-white border border-brand-border rounded-xl px-5 py-4 flex items-center justify-between hover:border-brand-green hover:shadow-sm transition-all cursor-pointer"
            >
              {/* 왼쪽: 편명 + 항공사 + 목적지 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-black text-sm text-brand-black">{f.flightId}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill ${badgeCls}`}>{f.remark}</span>
                </div>
                <p className="text-xs text-brand-muted truncate">
                  {f.airline} · {f.airport} <span className="text-brand-border">|</span> {f.terminalId} · {f.gateNumber}게이트
                </p>
              </div>

              {/* 오른쪽: 출발 시간 */}
              <div className="text-right shrink-0 ml-4">
                {delayed ? (
                  <>
                    <p className="text-xs text-brand-muted line-through">{sched.time}</p>
                    <p className="text-base font-bold text-brand-red">{est.time}</p>
                  </>
                ) : (
                  <p className="text-base font-bold text-brand-black">{sched.time}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
