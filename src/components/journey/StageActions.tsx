import type { JourneyStage } from '../../context/JourneyContext'
import { STAGE_ACTIONS } from './stageConfig'

interface Props {
  stage: JourneyStage
  onScan: () => void
  onNext: () => void
  nextLabel: string
}

export default function StageActions({ stage, onScan, onNext, nextLabel }: Props) {
  const actions = STAGE_ACTIONS[stage]

  return (
    <>
      {/* 티켓 미등록 — 시작 버튼 */}
      {stage === 'no_ticket' && (
        <div className="space-y-3">
          <button
            onClick={onScan}
            className="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-base"
          >
            📸 항공권 스캔으로 시작하기
          </button>
          <button className="w-full bg-white border border-brand-border text-brand-ink font-semibold py-3.5 rounded-xl hover:border-brand-green transition-colors">
            ✏️ 직접 항공편 입력
          </button>
        </div>
      )}

      {/* 현재 단계 할 일 */}
      {stage !== 'no_ticket' && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">지금 할 일</p>
          {actions.map((a, i) => (
            <div key={i}
              className="bg-white border border-brand-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-brand-green transition-colors cursor-pointer">
              <span className="text-2xl shrink-0">{a.icon}</span>
              <div>
                <p className="font-semibold text-brand-black text-sm">{a.text}</p>
                {a.sub && <p className="text-xs text-brand-muted mt-0.5">{a.sub}</p>}
              </div>
              <span className="ml-auto text-brand-muted text-sm">›</span>
            </div>
          ))}
        </div>
      )}

      {/* 다음 단계 버튼 */}
      {nextLabel && (
        <button
          onClick={onNext}
          className="w-full bg-brand-black text-white font-bold py-4 rounded-xl hover:bg-brand-ink transition-colors"
        >
          {nextLabel}
        </button>
      )}
    </>
  )
}
