import { useState } from 'react'
import type { ReactElement } from 'react'
import BottomTab, { type TabId } from './components/layout/BottomTab'
import { JourneyProvider } from './context/JourneyContext'
import { FlightProvider } from './context/FlightContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import FlightsPage from './pages/FlightsPage'
import MapPage from './pages/MapPage'
import MyPage from './pages/MyPage'
import LoginPage from './pages/LoginPage'
import GateFloatingButton from './components/GateFloatingButton'
import AirportChatbot from './components/chat/AirportChatbot'
import './App.css'

const PAGES: Record<TabId, ReactElement> = {
  home:    <HomePage />,
  journey: <JourneyPage />,
  flights: <FlightsPage />,
  map:     <MapPage />,
  my:      <MyPage />,
}

/** 로그인 상태에 따라 앱 or 로그인 화면 렌더 */
function AppShell() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<TabId>('home')

  // 세션 로딩 중 — 스플래시
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

  // 비로그인 — 로그인 화면
  if (!user) {
    return <LoginPage />
  }

  // 로그인됨 — 메인 앱
  return (
    <JourneyProvider>
      <FlightProvider>
        <div className="flex flex-col h-screen bg-brand-surface">
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {PAGES[tab]}
            <GateFloatingButton />
            <AirportChatbot />
          </main>
          <BottomTab active={tab} onChange={setTab} />
        </div>
      </FlightProvider>
    </JourneyProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
