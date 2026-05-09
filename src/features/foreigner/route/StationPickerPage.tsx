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
    <div className="flex flex-col h-full bg-brand-surface">
      {/* Dark header */}
      <div
        className="px-5 pt-10 pb-6 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 70%, #1a3320 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.18), transparent 65%)' }} />
        <div className="flex items-center gap-3 relative z-10">
          {isPickTo && (
            <button onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 shrink-0">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <div>
            <p className="font-display font-black text-[20px] text-white leading-snug">
              {isPickTo ? 'Where to? 🎯' : 'Where are you now? 📍'}
            </p>
            {isPickTo && phase.phase === 'pick-to' && (
              <p className="text-[12px] text-white/50 mt-0.5">
                From: <span className="font-bold text-brand-green">{phase.from.name_en}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-brand-border" />)}
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
