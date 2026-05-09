import StationGrid from './StationGrid'
import type { Station, RoutePhase } from '../../../types/foreigner'

type Props = {
  phase: Extract<RoutePhase, { phase: 'pick-from' | 'pick-to' }>
  stations: Station[]
  loading: boolean
  onSelectFrom: (s: Station) => void
  onSelectTo: (s: Station) => void
  onBack: () => void
}

export default function StationPickerPage({
  phase, stations, loading, onSelectFrom, onSelectTo, onBack,
}: Props) {
  const isPickTo = phase.phase === 'pick-to'

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex items-center gap-3">
        {isPickTo && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-surface">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7l6 6" stroke="#404840" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <div>
          <p className="font-black text-[18px] text-brand-black leading-snug">
            {isPickTo ? 'Where to?' : 'Where are you now?'}
          </p>
          {isPickTo && phase.phase === 'pick-to' && (
            <p className="text-[12px] text-brand-muted mt-0.5">
              From: <span className="font-bold text-brand-green">{phase.from.name_en}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-brand-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <StationGrid
            stations={stations}
            exclude={isPickTo && phase.phase === 'pick-to' ? phase.from.id : undefined}
            onSelect={isPickTo ? onSelectTo : onSelectFrom}
          />
        )}
      </div>
    </div>
  )
}
