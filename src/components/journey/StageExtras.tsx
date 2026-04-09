import type { JourneyStage } from '../../context/JourneyContext'
import type { ShuttleBus } from '../../services/shuttleApi'
import type { CongestionInfo } from '../../services/congestionApi'
import { congestionColor } from '../../services/congestionApi'

interface Props {
  stage: JourneyStage
  shuttles: ShuttleBus[]
  congestion: CongestionInfo[]
}

export default function StageExtras({ stage, shuttles, congestion }: Props) {
  return (
    <>
      {/* 이동 중 — 셔틀버스 정보 */}
      {stage === 'traveling' && shuttles.length > 0 && (
        <div>
          <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">셔틀버스 정보</p>
          <div className="space-y-2">
            {shuttles.map((s) => (
              <div key={s.route_id} className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚌</span>
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{s.route_name}</p>
                    <p className="text-xs text-brand-muted">배차 {s.interval}분 간격</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-black text-sm">{s.depart_time}</p>
                  <span className="text-[10px] text-brand-green font-bold">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 체크인 단계 — 보안검색 혼잡도 */}
      {stage === 'checkin' && congestion.length > 0 && (
        <div>
          <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">보안검색 라인 현황</p>
          <div className="grid grid-cols-5 gap-2">
            {congestion.map((c) => (
              <div key={c.line_number} className="bg-white border border-brand-border rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-brand-black mb-1">{c.line_number.replace('번 라인', '')}번</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-pill block ${congestionColor(c.congestion)}`}>
                  {c.congestion}
                </span>
                <p className="text-[10px] text-brand-muted mt-1">{c.wait_time}분</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 외부 대기 시 안내 */}
      {stage === 'external' && (
        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl shrink-0">⏰</span>
          <div>
            <p className="font-semibold text-brand-black text-sm">탑승 시간 전에 게이트로 입장하세요</p>
            <p className="text-xs text-brand-muted mt-0.5">화면 하단 버튼으로 언제든 게이트 입장 가능합니다</p>
          </div>
        </div>
      )}

      {/* 귀국 완료 */}
      {stage === 'returned' && (
        <div className="bg-brand-pale border border-brand-green/30 rounded-hero px-6 py-5 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-bold text-brand-black">여행 완료!</p>
          <p className="text-sm text-brand-muted mt-1">수고하셨습니다. 배지가 지급되었습니다.</p>
        </div>
      )}
    </>
  )
}
