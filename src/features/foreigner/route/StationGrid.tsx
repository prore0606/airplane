import type { Station } from '../../../types/foreigner'

type Props = {
  stations: Station[]
  exclude?: string
  onSelect: (s: Station) => void
  highlightFirst?: boolean
}

export default function StationGrid({ stations, exclude, onSelect, highlightFirst }: Props) {
  const list = exclude ? stations.filter(s => s.id !== exclude) : stations

  return (
    <div className="space-y-2.5">
      {list.map((s, i) => {
        const active = highlightFirst && i === 0
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-all border ${
              active
                ? 'bg-brand-green border-brand-green shadow-lg shadow-brand-green/25'
                : 'bg-white border-brand-border shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              active ? 'bg-white/20' : 'bg-brand-pale'
            }`}>
              {s.icon ?? '🚉'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black text-[15px] ${active ? 'text-white' : 'text-brand-black'}`}>
                {s.name_en}
              </p>
              <p className={`text-[12px] mt-0.5 ${active ? 'text-white/70' : 'text-brand-muted'}`}>
                {s.line_info}{active ? ' · You are here' : ''}
              </p>
            </div>
            <span className={`text-[18px] shrink-0 ${active ? 'text-white' : 'text-brand-muted'}`}>→</span>
          </button>
        )
      })}
    </div>
  )
}
