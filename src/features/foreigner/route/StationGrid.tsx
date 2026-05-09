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
          className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left hover:bg-brand-pale active:scale-[0.98] transition-all border border-brand-border"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-pale flex items-center justify-center text-xl shrink-0">
            {s.icon ?? '🚉'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[14px] text-brand-black">{s.name_en}</p>
            <p className="text-[11px] text-brand-muted mt-0.5">{s.line_info}</p>
          </div>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="shrink-0 text-brand-border">
            <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ))}
    </div>
  )
}
