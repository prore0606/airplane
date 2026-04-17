import type { FacilityCategory } from '../../data/airportFacilities'

export const CATEGORY_META = [
  { id: 'all'      as FacilityCategory | 'all', label: '전체',  icon: '🗺️' },
  { id: 'food'     as FacilityCategory | 'all', label: '식당',  icon: '🍽️' },
  { id: 'dutyfree' as FacilityCategory | 'all', label: '면세점', icon: '🛍️' },
  { id: 'lounge'   as FacilityCategory | 'all', label: '라운지', icon: '🛋️' },
  { id: 'atm'      as FacilityCategory | 'all', label: 'ATM',   icon: '🏧' },
  { id: 'exchange' as FacilityCategory | 'all', label: '환전',  icon: '💱' },
  { id: 'pharmacy' as FacilityCategory | 'all', label: '약국',  icon: '💊' },
]

interface Props {
  selected: FacilityCategory | 'all'
  onSelect: (cat: FacilityCategory | 'all', showList: boolean) => void
}

export default function MapCategoryChips({ selected, onSelect }: Props) {
  return (
    <div className="absolute top-3 left-0 right-0 z-10 px-3 pointer-events-none">
      <div className="flex gap-1.5 overflow-x-auto pb-1 pointer-events-auto" style={{ scrollbarWidth: 'none' }}>
        {CATEGORY_META.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id, c.id !== 'all')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all duration-150 ${
              selected === c.id
                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30'
                : 'bg-white/90 backdrop-blur-sm text-brand-ink shadow-md border border-white/60 hover:bg-white'
            }`}
          >
            <span className="text-[13px] leading-none">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
