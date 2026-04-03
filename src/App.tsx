import { useState } from 'react'
import BottomTab, { type TabId } from './components/layout/BottomTab'
import HomePage from './pages/HomePage'
import FlightPage from './pages/FlightPage'
import MapPage from './pages/MapPage'
import CharacterPage from './pages/CharacterPage'
import MyPage from './pages/MyPage'
import './App.css'

const PAGES: Record<TabId, React.ReactElement> = {
  home:      <HomePage />,
  flight:    <FlightPage />,
  map:       <MapPage />,
  character: <CharacterPage />,
  my:        <MyPage />,
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="relative w-full max-w-md min-h-screen bg-brand-surface flex flex-col shadow-xl">
        <main className="flex-1 overflow-hidden">
          {PAGES[tab]}
        </main>
        <BottomTab active={tab} onChange={setTab} />
      </div>
    </div>
  )
}
