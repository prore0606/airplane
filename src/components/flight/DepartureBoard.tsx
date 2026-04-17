import { useFlightContext } from '../../context/FlightContext'
import FlightCard from './FlightCard'

export default function DepartureBoard() {
  const { flights, loading } = useFlightContext()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">실시간 출발 현황</p>
        {!loading && (
          <span className="text-[10px] text-brand-green font-semibold bg-brand-pale px-2 py-0.5 rounded-pill">
            ● LIVE
          </span>
        )}
      </div>

      {loading && (
        <div className="bg-white border border-brand-border rounded-xl p-6 text-center">
          <div className="text-2xl mb-2 animate-pulse">✈️</div>
          <p className="text-sm text-brand-muted">운항 정보 로딩 중...</p>
        </div>
      )}

      {!loading && flights.map((f) => <FlightCard key={f.flightId} f={f} />)}
    </div>
  )
}
