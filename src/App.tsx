import { useState } from 'react'
import type { ReactElement } from 'react'
import SideNav from './components/layout/SideNav'
import { type TabId } from './components/layout/BottomTab'
import { JourneyProvider } from './context/JourneyContext'
import { FlightProvider } from './context/FlightContext'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import FlightsPage from './pages/FlightsPage'
import MapPage from './pages/MapPage'
import MyPage from './pages/MyPage'
import GateFloatingButton from './components/GateFloatingButton'
import './App.css'

const PAGES: Record<TabId, ReactElement> = {
  home:    <HomePage />,
  journey: <JourneyPage />,
  flights: <FlightsPage />,
  map:     <MapPage />,
  my:      <MyPage />,
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')

  return (
    <JourneyProvider>
      <FlightProvider>
        <div className="flex min-h-screen bg-brand-surface">
          <SideNav active={tab} onChange={setTab} />
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
            {PAGES[tab]}
            <GateFloatingButton />
          </main>
        </div>
      </FlightProvider>
    </JourneyProvider>
  )
}
