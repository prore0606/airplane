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
          {/* 데스크탑: 배경 + 중앙 폰 프레임 / 모바일: 풀스크린 */}
          <div className="
            md:min-h-screen md:flex md:items-center md:justify-center
            md:bg-gradient-to-br md:from-[#0a1a0f] md:via-[#0f2318] md:to-[#0a1a0f]
          ">
            {/* 데스크탑 장식 — 뒷배경 로고 */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none">
              <span className="font-display font-black text-[20vw] text-white/[0.02] tracking-tight">
                출국메이트
              </span>
            </div>

            {/* 폰 컨테이너 */}
            <div className="
              relative flex flex-col bg-brand-surface overflow-hidden
              w-full h-screen
              md:w-[393px] md:h-[852px] md:max-h-[95vh]
              md:rounded-[3rem] md:shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)]
            ">
              {/* 노치 (데스크탑에서만) */}
              <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50 items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#1a1a1a] ring-[1.5px] ring-black" />
                <div className="w-14 h-4 rounded-full bg-[#111]" />
              </div>

              {/* 콘텐츠 */}
              <main className="flex-1 flex flex-col overflow-hidden relative min-w-0 md:pt-7">
                {tab === 'home'    && <HomePage />}
                {tab === 'journey' && <JourneyPage />}
                {tab === 'flights' && <FlightsPage />}
                {tab === 'map'     && <MapPage initialCategory={mapInitCat} />}
                {tab === 'my'      && <MyPage />}
                <GateFloatingButton />
                <AirportChatbot />
              </main>

              <BottomTab active={tab} onChange={setTab} />
            </div>
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
