type Props = {
  toName: string
  durationMin: number
  onPickNew: () => void
}

export default function ArrivalPage({ toName, durationMin, onPickNew }: Props) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">

        <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center text-4xl shadow-lg shadow-brand-green/30">
          ✓
        </div>

        <div>
          <p className="font-black text-[26px] text-brand-black leading-tight">
            You've arrived.
          </p>
          <p className="text-brand-muted text-[14px] mt-2">{toName}</p>
        </div>

        <div className="bg-brand-surface rounded-2xl px-6 py-4 w-full">
          <p className="text-[12px] text-brand-muted font-mono uppercase tracking-widest mb-1">Trip Time</p>
          <p className="font-black text-[28px] text-brand-green">{durationMin} min</p>
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(toName)}`, '_blank', 'noopener')}
            className="w-full py-3.5 rounded-2xl bg-brand-green text-white font-bold text-[14px]"
          >
            📍 Open in Naver Map
          </button>
          <button
            onClick={onPickNew}
            className="w-full py-3.5 rounded-2xl border border-brand-border text-brand-ink font-bold text-[14px]"
          >
            ← Pick a new route
          </button>
        </div>
      </div>
    </div>
  )
}
