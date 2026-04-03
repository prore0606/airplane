import { useState } from 'react'
import SideNav from './components/layout/SideNav'
import { type TabId } from './components/layout/BottomTab'
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
    <div className="flex min-h-screen bg-brand-surface">
      <SideNav active={tab} onChange={setTab} />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {PAGES[tab]}
      </main>
    </div>
  )
}
