import type { RouteStep } from '../../../types/foreigner'
import type { Language } from '../../../types/foreigner'

type Props = {
  step: RouteStep
  total: number
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
  step, total, progress, isFirst, isLast, language, onNext, onPrev, onDone,
}: Props) {
  return (
    <div className="bg-white px-4 pt-3 pb-2 shrink-0">
      <div className="h-1 bg-brand-surface rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #15803d 0%, #1db954 100%)' }} />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onPrev} disabled={isFirst}
          className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center disabled:opacity-25 shrink-0 active:bg-brand-pale transition-colors">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="#404840" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-brand-muted font-mono uppercase tracking-widest mb-0.5">
            STEP {String(step.step_number).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <p className="font-bold text-[14px] text-brand-black leading-snug line-clamp-2">
            {getInstruction(step, language)}
          </p>
        </div>
        {isLast ? (
          <button onClick={onDone}
            className="bg-brand-green text-white font-black text-[13px] px-5 py-2.5 rounded-xl shrink-0 shadow-md shadow-brand-green/25 active:scale-[0.97] transition-all">
            Done ✓
          </button>
        ) : (
          <button onClick={onNext}
            className="bg-brand-green text-white font-black text-[13px] px-4 py-2.5 rounded-xl shrink-0 shadow-md shadow-brand-green/25 active:scale-[0.97] transition-all">
            Next →
          </button>
        )}
      </div>
      <p className="text-center text-[10px] text-brand-muted mt-2">
        Stuck? Tap <a href="tel:1330" className="text-red-500 font-bold">🆘 SOS</a> for help
      </p>
    </div>
  )
}
