import { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_ORDER } from '../context/JourneyContext'
import { useFlightContext } from '../context/FlightContext'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import { useParking } from '../hooks/useParking'
import { useBoardingScan } from '../hooks/useBoardingScan'
import ChapterBar from '../components/journey/ChapterBar'
import CharacterCard from '../components/journey/CharacterCard'
import StageActions from '../components/journey/StageActions'
import StageExtras from '../components/journey/StageExtras'
import BoardingCountdown from '../components/journey/BoardingCountdown'
import ChecklistConfirmModal from '../components/journey/ChecklistConfirmModal'
import TransportModal from '../components/journey/TransportModal'
import ScanModal from '../components/journey/ScanModal'
import ManualInputModal from '../components/journey/ManualInputModal'
import { NEXT_LABEL } from '../components/journey/stageConfig'
import { parseDatetime } from '../services/flightApi'
import type { ParsedBoardingPass } from '../services/ocr/boardingPassParser'

const COUNTDOWN_STAGES = new Set(['checkin', 'external', 'airside', 'boarding'])

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered, transportMode, setTransportMode } = useJourney()
  const { flights } = useFlightContext()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()
  const { data: parking } = useParking()
  const { scanStep, scanProgress, preview, parsed, handleFileSelect, handleRescan } = useBoardingScan()

  const [showScan,             setShowScan]             = useState(false)
  const [showManual,           setShowManual]           = useState(false)
  const [showChecklistConfirm, setShowChecklistConfirm] = useState(false)
  const [showTransportModal,   setShowTransportModal]   = useState(false)
  const [confirmedTerminal,    setConfirmedTerminal]    = useState<string | undefined>()

  const flight = flights[0]
  const departureHHMM = flight
    ? (() => {
        const raw = flight.scheduleDatetime ?? ''
        if (raw.length <= 4) return raw
        const { time } = parseDatetime(raw)
        return time.replace(':', '')
      })()
    : null

  function handleNext() {
    if (stage === 'traveling') { setShowChecklistConfirm(true); return }
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1])
  }

  function handleConfirm(info: ParsedBoardingPass) {
    setConfirmedTerminal(info.terminal)
    setFlightRegistered(true)
    setShowScan(false)
    setShowManual(false)
    setShowTransportModal(true)
  }

  function handleSelectTransit() { setTransportMode('transit'); setShowTransportModal(false); setStage('preparing') }
  function handleValetReserve()  { window.open('https://maxerve-mparking.com/valet', '_blank', 'noopener,noreferrer'); setTransportMode('car'); setShowTransportModal(false); setStage('preparing') }
  function handleSelfPark()      { setTransportMode('car'); setShowTransportModal(false); setStage('preparing') }
  function handleReset()         { setFlightRegistered(false); setStage('no_ticket') }
  function handleOpenScan()      { handleRescan(); setShowScan(true) }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-6">
          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}
          <CharacterCard stage={stage} flight={flight} />
          {COUNTDOWN_STAGES.has(stage) && <BoardingCountdown departureHHMM={departureHHMM} flightId={flight?.flightId} />}
          <StageActions stage={stage} transportMode={transportMode} onScan={handleOpenScan} onManualInput={() => setShowManual(true)} onNext={handleNext} nextLabel={NEXT_LABEL[stage] ?? ''} />
          <StageExtras stage={stage} shuttles={shuttles} congestion={congestion} parking={parking} terminal={confirmedTerminal} transportMode={transportMode} onReset={handleReset} />
        </div>
      </div>

      {showChecklistConfirm && (
        <ChecklistConfirmModal
          onConfirm={() => { setShowChecklistConfirm(false); setStage('checkin') }}
          onSkip={()    => { setShowChecklistConfirm(false); setStage('checkin') }}
        />
      )}
      {showTransportModal && <TransportModal onSelectTransit={handleSelectTransit} onValetReserve={handleValetReserve} onSelfPark={handleSelfPark} />}
      {showScan    && <ScanModal scanStep={scanStep} scanProgress={scanProgress} preview={preview} parsed={parsed} onClose={() => setShowScan(false)} onFileSelect={handleFileSelect} onRescan={handleRescan} onConfirm={handleConfirm} />}
      {showManual  && <ManualInputModal onClose={() => setShowManual(false)} onConfirm={handleConfirm} />}
    </div>
  )
}
