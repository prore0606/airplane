import TopNav from '../components/layout/TopNav'
import { useFlightContext } from '../context/FlightContext'
import AllFlightsTab from '../components/home/AllFlightsTab'

export default function FlightsPage() {
  const { flights, loading, lastUpdated, refetch } = useFlightContext()

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          <AllFlightsTab
            flights={flights}
            loading={loading}
            lastUpdated={lastUpdated}
            onRefetch={refetch}
          />
        </div>
      </div>
    </div>
  )
}
