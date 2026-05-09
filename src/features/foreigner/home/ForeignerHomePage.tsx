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
    <div className="flex flex-col h-full bg-brand-surface">
      {/* Dark hero */}
      <div
        className="px-5 pt-12 pb-7 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(160deg, #0f1410 0%, #1a2e20 70%, #1a3320 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,.2), transparent 65%)' }} />
        <p className="text-white/50 text-[13px] relative z-10">Hello, {name} 👋</p>
        <p className="font-display font-black text-[26px] text-white mt-0.5 leading-tight relative z-10">
          Welcome to Korea 🇰🇷
        </p>
        <button
          onClick={onGoRoute}
          className="mt-4 relative z-10 inline-flex items-center gap-2 bg-brand-green text-white font-bold text-[13px] px-5 py-2.5 rounded-pill shadow-lg shadow-brand-green/30 active:scale-[0.97] transition-all"
        >
          <span>🚉</span> Start Navigation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div>
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-2">
              Get to the City
            </p>
            <div className="space-y-2">
              {QUICK_ROUTES.map(r => <QuickRouteCard key={r.to} {...r} onPress={onGoRoute} />)}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-2">
              At the Airport
            </p>
            <div className="grid grid-cols-4 gap-2">
              {AIRPORT_INFO.map(({ emoji, label }) => (
                <div key={label} className="bg-white rounded-2xl py-3 flex flex-col items-center gap-1.5 border border-brand-border shadow-sm">
                  <span className="text-2xl">{emoji}</span>
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
