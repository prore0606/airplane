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
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-12 pb-5 shrink-0">
        {isPickTo && (
          <button onClick={onBack}
            className="mb-5 w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7l6 6" stroke="#404840" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <h1 className="font-display font-black text-[28px] text-brand-black leading-tight whitespace-pre-line">
          {isPickTo ? 'Where to?' : 'Where are\nyou now?'}
        </h1>
        <p className="text-brand-muted text-[14px] mt-2">
          {isPickTo && phase.phase === 'pick-to'
            ? `From: ${phase.from.name_en}`
            : 'Pick your starting station'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-brand-surface rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <StationGrid
            stations={stations}
            exclude={isPickTo && phase.phase === 'pick-to' ? phase.from.id : undefined}
            onSelect={isPickTo ? onSelectTo : onSelectFrom}
            highlightFirst={!isPickTo}
          />
        )}
      </div>
    </div>
  )
}
