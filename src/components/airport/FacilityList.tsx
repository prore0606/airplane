import { useState } from 'react'
import { FACILITIES } from '../../data/airportFacilities'
import type { FacilityType, TerminalCode } from '../../data/airportFacilities'

interface Props {
  terminal?: string // 'T1' | 'T2'
}

const TAB_CONFIG: { type: FacilityType; label: string; icon: string }[] = [
  { type: 'dutyfree', label: '면세점',    icon: '💎' },
  { type: 'shopping', label: '일반쇼핑',  icon: '🛍️' },
  { type: 'food',     label: '식음료',    icon: '🍽️' },
]

const BADGE_STYLE = {
  '24H': 'bg-brand-green text-white',
  BEST:  'bg-yellow-400 text-yellow-900',
  NEW:   'bg-blue-500 text-white',
}

export default function FacilityList({ terminal }: Props) {
  const [activeType, setActiveType] = useState<FacilityType>('dutyfree')
  const [activeTerm, setActiveTerm] = useState<TerminalCode>(
    terminal === 'T2' ? 'T2' : 'T1'
  )

  const items = FACILITIES.filter(
    (f) => f.type === activeType && (f.terminal === activeTerm || f.terminal === 'ALL')
  )

  return (
    <div className="space-y-3">
      {/* 카테고리 탭 */}
      <div className="flex gap-2">
        {TAB_CONFIG.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border text-xs font-bold transition-colors
              ${activeType === type
                ? 'bg-brand-black text-white border-brand-black'
                : 'bg-white text-brand-body border-brand-border hover:border-brand-green'
              }`}
          >
            <span className="text-base mb-0.5">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* 터미널 필터 */}
      <div className="flex gap-2">
        {(['T1', 'T2'] as TerminalCode[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTerm(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors
              ${activeTerm === t
                ? 'bg-brand-green text-white border-brand-green'
                : 'bg-white text-brand-muted border-brand-border'
              }`}
          >
            {t} 터미널
          </button>
        ))}
      </div>

      {/* 시설 목록 */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-brand-muted text-center py-6">해당 터미널에 정보가 없습니다</p>
        ) : (
          items.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-start gap-3"
            >
              <span className="text-2xl shrink-0 mt-0.5">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-brand-black text-sm">{f.name}</p>
                  {f.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${BADGE_STYLE[f.badge]}`}>
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5">{f.category}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-brand-muted">
                  <span>📍 {f.location}</span>
                  <span>⏰ {f.hours}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
