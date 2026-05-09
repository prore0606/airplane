import { useAuth } from '../../../context/AuthContext'
import QuickRouteCard from './QuickRouteCard'
import EmergencyRow from './EmergencyRow'

const QUICK_ROUTES = [
  { from: 'ICN T1', to: 'Seoul Station', method: 'AREX Express', duration: '52 min', price: '₩9,500' },
  { from: 'ICN T1', to: 'Hongdae',       method: 'AREX All-stop', duration: '66 min', price: '₩4,250' },
]

const AIRPORT_INFO = [
  { emoji: '💱', label: 'Exchange' },
  { emoji: '📡', label: 'SIM Card' },
  { emoji: '🏧', label: 'ATM'      },
  { emoji: '💊', label: 'Pharmacy' },
]

type Props = { onGoRoute: () => void }

export default function ForeignerHomePage({ onGoRoute }: Props) {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Traveler'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

          <div>
            <p className="text-sm text-brand-muted">Hello, {name} 👋</p>
            <p className="text-xl font-bold text-brand-black mt-1">Welcome to Korea 🇰🇷</p>
          </div>

          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
              Get to the City
            </p>
            <div className="space-y-2">
              {QUICK_ROUTES.map(r => (
                <QuickRouteCard key={r.to} {...r} onPress={onGoRoute} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
              At the Airport
            </p>
            <div className="grid grid-cols-4 gap-2">
              {AIRPORT_INFO.map(({ emoji, label }) => (
                <div key={label} className="bg-white rounded-xl py-3 flex flex-col items-center gap-1 border border-brand-border">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-[10px] text-brand-muted font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <EmergencyRow />

        </div>
      </div>
    </div>
  )
}
