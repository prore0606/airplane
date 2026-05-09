import { useState } from 'react'
import { useForeignerRoute } from '../hooks/useForeignerRoute'
import ForeignerBottomTab from '../features/foreigner/layout/ForeignerBottomTab'
import ForeignerHomePage from '../features/foreigner/home/ForeignerHomePage'
import StationPickerPage from '../features/foreigner/route/StationPickerPage'
import RoadviewPage from '../features/foreigner/route/RoadviewPage'
import ArrivalPage from '../features/foreigner/route/ArrivalPage'
import ForeignerMyPage from '../features/foreigner/my/ForeignerMyPage'
import MapPage from './MapPage'
import type { ForeignerTab } from '../types/foreigner'

export default function ForeignerApp() {
  const [tab, setTab] = useState<ForeignerTab>('home')
  const { stations, phase, loading, selectFrom, selectTo, completeRoute, reset, goBack } =
    useForeignerRoute()

  function handleGoRoute() { setTab('route') }

  function renderRouteTab() {
    if (phase.phase === 'pick-from' || phase.phase === 'pick-to') {
      return (
        <StationPickerPage
          phase={phase}
          stations={stations}
          loading={loading}
          onSelectFrom={selectFrom}
          onSelectTo={selectTo}
          onBack={goBack}
        />
      )
    }
    if (phase.phase === 'roadview') {
      return (
        <RoadviewPage
          steps={phase.steps}
          onComplete={completeRoute}
        />
      )
    }
    if (phase.phase === 'arrival') {
      return (
        <ArrivalPage
          toName={phase.to.name_en}
          durationMin={phase.durationMin}
          onPickNew={reset}
        />
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-brand-surface overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        {tab === 'home'  && <ForeignerHomePage onGoRoute={handleGoRoute} />}
        {tab === 'route' && renderRouteTab()}
        {tab === 'map'   && <MapPage initialCategory="all" />}
        {tab === 'my'    && <ForeignerMyPage />}
      </main>
      <ForeignerBottomTab active={tab} onChange={setTab} />
    </div>
  )
}
