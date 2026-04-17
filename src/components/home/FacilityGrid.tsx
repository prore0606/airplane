import { useNavigation } from '../../context/NavigationContext'
import type { FacilityCategory } from '../../data/airportFacilities'

const FACILITIES: { icon: string; name: string; cat: FacilityCategory }[] = [
  { icon: '🍽️', name: '식당',  cat: 'food' },
  { icon: '🛍️', name: '면세점', cat: 'dutyfree' },
  { icon: '🛋️', name: '라운지', cat: 'lounge' },
  { icon: '💱', name: '환전',  cat: 'exchange' },
  { icon: '🏧', name: 'ATM',  cat: 'atm' },
  { icon: '💊', name: '약국',  cat: 'pharmacy' },
]

export default function FacilityGrid() {
  const { goToMap } = useNavigation()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-brand-black">공항 내 시설</p>
        <button
          onClick={() => goToMap('all')}
          className="text-sm text-brand-green font-semibold hover:text-brand-dark transition-colors"
        >
          전체보기 ›
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {FACILITIES.map((f) => (
          <button
            key={f.name}
            onClick={() => goToMap(f.cat)}
            className="bg-white border border-brand-border rounded-xl py-3.5 flex flex-col items-center gap-1.5 hover:border-brand-green hover:bg-brand-pale active:scale-95 transition-all"
          >
            <span className="text-2xl leading-none">{f.icon}</span>
            <span className="text-[10px] text-brand-muted font-semibold">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
