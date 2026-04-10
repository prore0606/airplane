import TopNav from '../components/layout/TopNav'
import { useCongestion } from '../hooks/useCongestion'
import { useFlightContext } from '../context/FlightContext'
import FlightHeroCard from '../components/home/FlightHeroCard'
import { CongestionMiniCard, CongestionGrid } from '../components/home/CongestionSection'
import FacilityGrid from '../components/home/FacilityGrid'
import FlightPreviewList from '../components/home/FlightPreviewList'

export default function HomePage() {
  const { flights, loading } = useFlightContext()
  const { data: congestion, loading: congestionLoading, lastUpdated, refetch: refetchCongestion } = useCongestion()

  const fastest = congestion.reduce<typeof congestion[0] | null>((a, b) =>
    !a || Number(b.wait_time) < Number(a.wait_time) ? b : a, null)
  const next = flights[0] ?? null

  return (
    <div className="flex flex-col h-full">
      <TopNav showNotifDot />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">

          <div>
            <p className="text-sm text-brand-muted">안녕하세요 👋</p>
            <p className="text-xl font-bold text-brand-black mt-1">
              {next ? `${next.airport} 출발 준비됐나요?` : 'D-2 출국 준비됐나요?'}
            </p>
          </div>

          <FlightHeroCard flight={next} loading={loading} />

          <div className="grid grid-cols-2 gap-4">
            <CongestionMiniCard fastest={fastest} />
            <div className="bg-brand-green rounded-card p-5">
              <p className="text-[10px] text-white/65 font-semibold uppercase tracking-wider mb-2">내 차 위치</p>
              <p className="text-xl font-bold text-white">A구역 3층</p>
              <p className="text-xs text-white/60 mt-1">저장 완료 · 안내 준비</p>
            </div>
          </div>

          <CongestionGrid
            congestion={congestion}
            loading={congestionLoading}
            lastUpdated={lastUpdated}
            onRefetch={refetchCongestion}
          />

          {!loading && <FlightPreviewList flights={flights} />}

          <FacilityGrid />

        </div>
      </div>
    </div>
  )
}
