import { useState } from 'react'
import type { ReactElement } from 'react'
import BottomTab, { type TabId } from './components/layout/BottomTab'
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
        <div className="flex flex-col h-screen bg-brand-surface">
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {PAGES[tab]}
            <GateFloatingButton />
          </main>
          <BottomTab active={tab} onChange={setTab} />
        </div>
      </FlightProvider>
    </JourneyProvider>
  )
}
