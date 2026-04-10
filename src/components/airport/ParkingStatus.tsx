import { useState } from 'react'
import { parkingStatus, lotTerminal, lotType, type ParkingLot } from '../../services/parkingApi'

interface Props {
  lots: ParkingLot[]
  terminal?: string  // 탑승권 기반 자동 선택 ('T1' | 'T2')
}

type TerminalTab = 'T1' | 'T2'
type TypeFilter  = '전체' | '단기' | '장기' | '예약'

const TYPE_FILTERS: TypeFilter[] = ['전체', '단기', '장기', '예약']

const STATUS_COLOR = {
  '여유': { bg: 'bg-brand-green',  text: 'text-white',        badge: 'bg-brand-pale border-brand-green/30 text-brand-green' },
  '보통': { bg: 'bg-yellow-400',   text: 'text-white',        badge: 'bg-yellow-50 border-yellow-200 text-yellow-700'       },
  '혼잡': { bg: 'bg-orange-500',   text: 'text-white',        badge: 'bg-orange-50 border-orange-200 text-orange-600'       },
  '만차': { bg: 'bg-red-500',      text: 'text-white',        badge: 'bg-red-50 border-red-200 text-red-600'                },
  '정보없음': { bg: 'bg-gray-300', text: 'text-gray-600',     badge: 'bg-gray-50 border-gray-200 text-gray-500'            },
}

function LotCard({ lot }: { lot: ParkingLot }) {
  const { label, pct } = parkingStatus(lot.parking, lot.parkingarea)
  const s = STATUS_COLOR[label as keyof typeof STATUS_COLOR] ?? STATUS_COLOR['정보없음']
  const total  = Number(lot.parkingarea)
  const avail  = Math.max(0, total - Number(lot.parking))
  // floor 에서 터미널 접두어 제거해 짧은 이름으로 표시
  const shortName = lot.floor.replace(/^T[12]\s*/, '')

  return (
    <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
      {/* 상태 컬러 헤더 */}
      <div className={`${s.bg} px-4 py-2 flex items-center justify-between`}>
        <span className={`text-xs font-black ${s.text}`}>{shortName}</span>
        <span className={`text-[10px] font-bold ${s.text} opacity-80`}>{lotType(lot.floor)}</span>
      </div>

      {/* 잔여 대수 */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[10px] text-brand-muted">잔여</p>
            <p className="text-2xl font-black text-brand-black leading-none">
              {avail.toLocaleString()}
              <span className="text-xs font-normal text-brand-muted ml-0.5">대</span>
            </p>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.badge}`}>
            {label}
          </span>
        </div>

        {/* 사용률 바 */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all ${s.bg}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-brand-muted">
          <span>전체 {total.toLocaleString()}대</span>
          <span>{pct}% 사용 중</span>
        </div>
      </div>
    </div>
  )
}

export default function ParkingStatus({ lots, terminal }: Props) {
  const [activeTab, setActiveTab]     = useState<TerminalTab>(terminal === 'T2' ? 'T2' : 'T1')
  const [typeFilter, setTypeFilter]   = useState<TypeFilter>('전체')

  if (lots.length === 0) return null

  // 터미널 필터
  const byTerminal = lots.filter((l) => lotTerminal(l.floor) === activeTab)

  // 단기/장기/예약 필터
  const filtered = typeFilter === '전체'
    ? byTerminal
    : byTerminal.filter((l) => lotType(l.floor) === typeFilter)

  // 갱신 시각
  const rawTime = lots[0]?.datetm ?? ''
  const updatedAt = rawTime.length >= 12
    ? `${rawTime.slice(8,10)}:${rawTime.slice(10,12)} 기준`
    : ''

  // 탭별 잔여 합산 (뱃지용)
  function tabAvail(tab: TerminalTab) {
    const sum = lots
      .filter((l) => lotTerminal(l.floor) === tab)
      .reduce((acc, l) => acc + Math.max(0, Number(l.parkingarea) - Number(l.parking)), 0)
    return sum.toLocaleString()
  }

  return (
    <div className="space-y-4">

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">실시간 주차 현황</p>
        <span className="text-[10px] text-brand-muted">{updatedAt}</span>
      </div>

      {/* 터미널 탭 */}
      <div className="grid grid-cols-2 gap-2">
        {(['T1', 'T2'] as TerminalTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl py-3 flex flex-col items-center border-2 transition-all ${
              activeTab === tab
                ? 'border-brand-green bg-brand-pale'
                : 'border-brand-border bg-white'
            }`}
          >
            <span className={`text-sm font-black ${activeTab === tab ? 'text-brand-green' : 'text-brand-black'}`}>
              {tab} 터미널
            </span>
            <span className="text-[10px] text-brand-muted mt-0.5">잔여 {tabAvail(tab)}대</span>
            {terminal === tab && (
              <span className="text-[9px] bg-brand-green text-white px-1.5 py-0.5 rounded-full mt-1 font-bold">내 터미널</span>
            )}
          </button>
        ))}
      </div>

      {/* 단기/장기 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              typeFilter === f
                ? 'bg-brand-black text-white border-brand-black'
                : 'bg-white text-brand-muted border-brand-border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 주차장 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-sm text-brand-muted text-center py-6">해당 구역 정보가 없습니다</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((l) => <LotCard key={l.floor} lot={l} />)}
        </div>
      )}

    </div>
  )
}
