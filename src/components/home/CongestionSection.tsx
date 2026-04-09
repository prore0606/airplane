import type { CongestionInfo } from '../../services/congestionApi'
import { congestionColor } from '../../services/congestionApi'

interface Props {
  congestion: CongestionInfo[]
  fastest: CongestionInfo | null
}

export function CongestionMiniCard({ fastest }: { fastest: CongestionInfo | null }) {
  return (
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
  )
}

export function CongestionGrid({ congestion }: Pick<Props, 'congestion'>) {
  if (congestion.length === 0) return null
  return (
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
  )
}
