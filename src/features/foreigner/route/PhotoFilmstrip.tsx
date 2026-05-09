import type { RouteStep } from '../../../types/foreigner'

type Props = {
  steps: RouteStep[]
  currentIndex: number
  onJump: (i: number) => void
}

export default function PhotoFilmstrip({ steps, currentIndex, onJump }: Props) {
  return (
    <div className="bg-white px-4 py-3 shrink-0">
      <p className="text-[9px] text-brand-muted font-mono uppercase tracking-widest mb-2">
        Photo Sequence
      </p>
      <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            className="shrink-0 relative rounded"
            style={{ width: 44, height: 58 }}
          >
            <div
              className="w-full h-full rounded flex items-end justify-start p-0.5 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(21,128,61,.7), rgba(15,26,20,.9))',
                outline: i === currentIndex ? '2px solid #22C55E' : 'none',
                opacity: i < currentIndex ? 0.4 : 1,
              }}
            >
              <span className="text-white text-[7px] font-bold bg-black/50 px-1 rounded">
                {String(s.step_number).padStart(2, '0')}
              </span>
            </div>
            {s.photo_url && (
              <img src={s.photo_url} alt="" className="absolute inset-0 w-full h-full object-cover rounded" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
