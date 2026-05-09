import type { RouteStep } from '../../../types/foreigner'
import type { Language } from '../../../types/foreigner'

type Props = {
  step: RouteStep
  progress: number
  isFirst: boolean
  isLast: boolean
  language: Language
  onNext: () => void
  onPrev: () => void
  onDone: () => void
}

function getInstruction(step: RouteStep, lang: Language): string {
  if (lang === 'ja' && step.instruction_ja) return step.instruction_ja
  if (lang === 'zh' && step.instruction_zh) return step.instruction_zh
  return step.instruction_en
}

export default function RoadviewControls({
  step, progress, isFirst, isLast, language, onNext, onPrev, onDone,
}: Props) {
  return (
    <div className="bg-white px-4 pt-3 pb-2 border-b border-brand-surface shrink-0">
      {/* 진행바 */}
      <div className="h-1 bg-brand-surface rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #15803D 0%, #22C55E 100%)' }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center text-brand-ink disabled:opacity-30 shrink-0"
        >
          ←
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-brand-muted font-mono uppercase tracking-widest">
            STEP {step.step_number}
          </p>
          <p className="font-bold text-[13px] text-brand-black leading-snug line-clamp-2">
            {getInstruction(step, language)}
          </p>
        </div>

        {isLast ? (
          <button
            onClick={onDone}
            className="bg-brand-green text-white font-bold text-[12px] px-4 py-2.5 rounded-xl shrink-0"
          >
            Done ✓
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-brand-green text-white font-bold text-[12px] px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
