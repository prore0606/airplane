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
        {/* 데스크톱: 어두운 배경 + 중앙 폰 프레임 */}
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">

          {/* 폰 프레임 — 모바일은 풀스크린, 데스크톱은 폰 크기로 */}
          <div className="
            relative flex flex-col bg-brand-surface overflow-hidden
            w-full h-screen
            sm:w-[390px] sm:h-[844px] sm:rounded-[44px]
            sm:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.7)]
          ">
            {/* 상단 노치 영역 (데스크톱 폰 프레임용) */}
            <div className="hidden sm:flex items-center justify-between px-7 pt-4 pb-1 bg-white shrink-0">
              <span className="text-xs font-bold text-brand-black">9:41</span>
              <div className="w-24 h-5 bg-brand-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="flex items-center gap-1 text-xs text-brand-black">
                <span>●●●</span>
                <span className="font-bold">100%</span>
              </div>
            </div>

            {/* 페이지 컨텐츠 */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
              {PAGES[tab]}
              <GateFloatingButton />
            </main>

            {/* 하단 탭바 */}
            <BottomTab active={tab} onChange={setTab} />
          </div>

        </div>
      </FlightProvider>
    </JourneyProvider>
  )
}
