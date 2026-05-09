type Props = {
  toName: string
  durationMin: number
  onPickNew: () => void
}

export default function ArrivalPage({ toName, durationMin, onPickNew }: Props) {
  return (
    <div className="flex flex-col h-full bg-brand-surface">
      {/* Dark hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 70%, #1a3320 100%)' }}
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.25), transparent 65%)' }} />
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center text-4xl shadow-2xl shadow-brand-green/40">
            ✓
          </div>
          <div>
            <p className="font-display font-black text-[28px] text-white leading-tight">You've arrived.</p>
            <p className="text-white/50 text-[14px] mt-1">{toName}</p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl px-8 py-4 backdrop-blur-sm">
            <p className="text-[11px] text-white/40 font-mono uppercase tracking-widest">Trip Time</p>
            <p className="font-display font-black text-[36px] text-brand-green leading-none mt-1">
              {durationMin}<span className="text-[16px] text-white/50 font-bold ml-1">min</span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-5 space-y-2 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(toName)}`, '_blank', 'noopener')}
            className="flex-1 py-4 rounded-2xl bg-brand-green text-white font-bold text-[13px] shadow-lg shadow-brand-green/25 active:scale-[0.98] transition-all"
          >
            🗺 Naver Map
          </button>
          <button
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(toName)}`, '_blank', 'noopener')}
            className="flex-1 py-4 rounded-2xl bg-white border border-brand-border text-brand-black font-bold text-[13px] shadow-sm active:scale-[0.98] transition-all"
          >
            📍 Google Maps
          </button>
        </div>
        <button
          onClick={onPickNew}
          className="w-full py-4 rounded-2xl border border-brand-border text-brand-ink font-bold text-[14px] bg-white active:scale-[0.98] transition-all"
        >
          ← Pick a new route
        </button>
      </div>
    </div>
  )
}
