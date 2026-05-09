import type { Station } from '../../../types/foreigner'

type Props = {
  stations: Station[]
  exclude?: string
  onSelect: (s: Station) => void
}

export default function StationGrid({ stations, exclude, onSelect }: Props) {
  const list = exclude ? stations.filter(s => s.id !== exclude) : stations

  return (
    <div className="space-y-2">
      {list.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left active:bg-brand-pale active:scale-[0.98] transition-all border border-brand-border shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-pale flex items-center justify-center text-2xl shrink-0">
            {s.icon ?? '🚉'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[15px] text-brand-black">{s.name_en}</p>
            <p className="text-[11px] text-brand-muted mt-0.5">{s.line_info}</p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
            <svg width="5" height="9" viewBox="0 0 6 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke="#8A9E92" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </button>
      ))}
    </div>
  )
}
