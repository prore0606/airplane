import { useState } from 'react'
import BottomTab, { type TabId } from './components/layout/BottomTab'
import { JourneyProvider } from './context/JourneyContext'
import { FlightProvider } from './context/FlightContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NavigationContext } from './context/NavigationContext'
import type { FacilityCategory } from './data/airportFacilities'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import FlightsPage from './pages/FlightsPage'
import MapPage from './pages/MapPage'
import MyPage from './pages/MyPage'
import LoginPage from './pages/LoginPage'
import GateFloatingButton from './components/GateFloatingButton'
import AirportChatbot from './components/chat/AirportChatbot'
import './App.css'

function AppShell() {
  const { user, loading } = useAuth()
  const [tab, setTab]           = useState<TabId>('home')
  const [mapInitCat, setMapInitCat] = useState<FacilityCategory | 'all'>('all')

  function goToMap(category: FacilityCategory | 'all' = 'all') {
    setMapInitCat(category)
    setTab('map')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-black gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center text-3xl animate-pulse">
          ✈️
        </div>
        <p className="font-display font-black text-xl text-white tracking-tight">
          출국<span className="text-brand-green">메이트</span>
        </p>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <NavigationContext.Provider value={{ goToMap }}>
      <JourneyProvider>
        <FlightProvider>
          <div className="flex flex-col h-screen bg-brand-surface overflow-hidden">
            {/* 콘텐츠 */}
            <main className="flex-1 overflow-hidden relative">
              {tab === 'home'    && <HomePage />}
              {tab === 'journey' && <JourneyPage />}
              {tab === 'flights' && <FlightsPage />}
              {tab === 'map'     && <MapPage initialCategory={mapInitCat} />}
              {tab === 'my'      && <MyPage />}
              <GateFloatingButton />
              <AirportChatbot />
            </main>

            {/* 항상 하단 탭바 */}
            <BottomTab active={tab} onChange={setTab} />
          </div>
        </FlightProvider>
      </JourneyProvider>
    </NavigationContext.Provider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
