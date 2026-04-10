import { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_ORDER } from '../context/JourneyContext'
import { useFlightContext } from '../context/FlightContext'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import { useParking } from '../hooks/useParking'
import ChapterBar from '../components/journey/ChapterBar'
import CharacterCard from '../components/journey/CharacterCard'
import StageActions from '../components/journey/StageActions'
import StageExtras from '../components/journey/StageExtras'
import BoardingCountdown from '../components/journey/BoardingCountdown'
import ImageUploader from '../components/scan/ImageUploader'
import ScanProgress from '../components/scan/ScanProgress'
import OcrResultForm from '../components/scan/OcrResultForm'
import { NEXT_LABEL } from '../components/journey/stageConfig'
import ChecklistConfirmModal from '../components/journey/ChecklistConfirmModal'
import { parseDatetime } from '../services/flightApi'
import { extractTextFromImage } from '../services/ocr/tesseractService'
import { parseBoardingPass, type ParsedBoardingPass } from '../services/ocr/boardingPassParser'

type ScanStep = 'idle' | 'scanning' | 'result'

const COUNTDOWN_STAGES = new Set(['checkin', 'external', 'airside', 'boarding'])

const CLOSE_BTN = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered, transportMode, setTransportMode } = useJourney()
  const { flights } = useFlightContext()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()
  const { data: parking } = useParking()

  // 스캔 모달
  const [showScan, setShowScan] = useState(false)
  const [scanStep, setScanStep] = useState<ScanStep>('idle')
  const [scanProgress, setScanProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedBoardingPass | null>(null)

  // 직접 입력 모달
  const [showManual, setShowManual] = useState(false)

  // 체크리스트 확인 모달 (traveling → checkin 전환 시)
  const [showChecklistConfirm, setShowChecklistConfirm] = useState(false)

  // 이동수단 선택 모달 (step1: 자가용/대중교통, step2: 발렛 여부)
  const [showTransportModal, setShowTransportModal] = useState(false)
  const [transportStep, setTransportStep] = useState<'mode' | 'valet'>('mode')

  // 탑승권 터미널
  const [confirmedTerminal, setConfirmedTerminal] = useState<string | undefined>(undefined)

  const nextLabel = NEXT_LABEL[stage] ?? ''
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
    // traveling → checkin 전환 시 체크리스트 확인 모달 먼저
    if (stage === 'traveling') {
      setShowChecklistConfirm(true)
      return
    }
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1])
  }

  function handleChecklistConfirm() {
    setShowChecklistConfirm(false)
    setStage('checkin')
  }

  function handleChecklistSkip() {
    setShowChecklistConfirm(false)
    setStage('checkin')
  }

  function handleOpenScan() {
    setScanStep('idle')
    setScanProgress(0)
    setPreview(null)
    setParsed(null)
    setShowScan(true)
  }

  async function handleFileSelect(file: File) {
    setPreview(URL.createObjectURL(file))
    setScanStep('scanning')
    setScanProgress(0)
    try {
      const { text } = await extractTextFromImage(file, setScanProgress)
      setScanProgress(100)
      const result = parseBoardingPass(text)
      setParsed(result)
      setScanStep('result')
    } catch {
      setScanStep('idle')
      alert('이미지 인식에 실패했습니다. 다시 시도해주세요.')
    }
  }

  function handleOpenManual() {
    setShowManual(true)
  }

  /** 탑승권 확인 → 이동수단 선택 모달 표시 */
  function handleConfirm(info: ParsedBoardingPass) {
    setConfirmedTerminal(info.terminal)
    setFlightRegistered(true)
    setShowScan(false)
    setShowManual(false)
    setTransportStep('mode')
    setShowTransportModal(true)
  }

  /** 자가용 선택 → 발렛 질문 단계로 */
  function handleSelectCar() {
    setTransportStep('valet')
  }

  /** 대중교통 선택 → 바로 여정 시작 */
  function handleSelectTransit() {
    setTransportMode('transit')
    setShowTransportModal(false)
    setStage('preparing')
  }

  /** 발렛 예약 → 외부 링크 열고 + 자가용으로 여정 시작 */
  function handleValetReserve() {
    window.open('https://maxerve-mparking.com/valet', '_blank', 'noopener,noreferrer')
    setTransportMode('car')
    setShowTransportModal(false)
    setStage('preparing')
  }

  /** 직접 주차 → 자가용으로 여정 시작 */
  function handleSelfPark() {
    setTransportMode('car')
    setShowTransportModal(false)
    setStage('preparing')
  }

  function handleRescan() {
    setScanStep('idle')
    setPreview(null)
    setParsed(null)
    setScanProgress(0)
  }

  function handleReset() {
    setFlightRegistered(false)
    setStage('no_ticket')
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-6">

          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}

          <CharacterCard stage={stage} flight={flight} />

          {COUNTDOWN_STAGES.has(stage) && (
            <BoardingCountdown
              departureHHMM={departureHHMM}
              flightId={flight?.flightId}
            />
          )}

          <StageActions
            stage={stage}
            transportMode={transportMode}
            onScan={handleOpenScan}
            onManualInput={handleOpenManual}
            onNext={handleNext}
            nextLabel={nextLabel}
          />

          <StageExtras
            stage={stage}
            shuttles={shuttles}
            congestion={congestion}
            parking={parking}
            terminal={confirmedTerminal}
            transportMode={transportMode}
            onReset={handleReset}
          />

        </div>
      </div>

      {/* ── 체크리스트 확인 모달 ── */}
      {showChecklistConfirm && (
        <ChecklistConfirmModal
          onConfirm={handleChecklistConfirm}
          onSkip={handleChecklistSkip}
        />
      )}

      {/* ── 이동수단 선택 모달 ── */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl px-6 pt-6 pb-10">
            <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mb-6" />

            {/* Step 1 — 이동수단 */}
            {transportStep === 'mode' && (
              <>
                <p className="font-black text-lg text-brand-black text-center mb-1">공항까지 어떻게 가시나요?</p>
                <p className="text-xs text-brand-muted text-center mb-6">이동 방법에 맞게 안내해 드릴게요</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSelectCar}
                    className="flex flex-col items-center justify-center gap-3 bg-brand-surface border-2 border-brand-border rounded-2xl py-8 hover:border-brand-green hover:bg-brand-pale transition-all"
                  >
                    <span className="text-4xl">🚗</span>
                    <div className="text-center">
                      <p className="font-bold text-brand-black text-sm">자가용</p>
                      <p className="text-[11px] text-brand-muted mt-0.5">주차 현황 안내</p>
                    </div>
                  </button>
                  <button
                    onClick={handleSelectTransit}
                    className="flex flex-col items-center justify-center gap-3 bg-brand-surface border-2 border-brand-border rounded-2xl py-8 hover:border-brand-green hover:bg-brand-pale transition-all"
                  >
                    <span className="text-4xl">🚇</span>
                    <div className="text-center">
                      <p className="font-bold text-brand-black text-sm">대중교통</p>
                      <p className="text-[11px] text-brand-muted mt-0.5">셔틀·리무진 안내</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Step 2 — 발렛 여부 */}
            {transportStep === 'valet' && (
              <>
                <button
                  onClick={() => setTransportStep('mode')}
                  className="flex items-center gap-1 text-xs text-brand-muted mb-4 hover:text-brand-black transition-colors"
                >
                  ← 이전
                </button>
                <p className="font-black text-lg text-brand-black text-center mb-1">발렛 주차를 이용하시겠어요?</p>
                <p className="text-xs text-brand-muted text-center mb-6">
                  인천공항 공식 주차대행 서비스 (맥서브)<br/>
                  <span className="text-brand-orange font-medium">현장 접수 불가 · 사전 예약 필수</span>
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleValetReserve}
                    className="w-full flex items-center justify-center gap-3 bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors"
                  >
                    <span className="text-xl">🅿️</span>
                    발렛 예약하고 출발하기
                    <span className="text-xs opacity-70 ml-1">↗</span>
                  </button>
                  <button
                    onClick={handleSelfPark}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-ink font-semibold py-3.5 rounded-xl hover:border-brand-green transition-colors"
                  >
                    직접 주차할게요
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ── 스캔 모달 ── */}
      {showScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => scanStep !== 'scanning' && setShowScan(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-5 py-4 flex items-center justify-between border-b border-brand-border shrink-0">
              <div>
                <p className="font-black text-base text-brand-black">
                  {scanStep === 'idle' && '항공권 가져오기'}
                  {scanStep === 'scanning' && '정보 인식 중...'}
                  {scanStep === 'result' && '정보 확인 · 수정'}
                </p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {scanStep === 'idle' && 'AI가 편명·게이트·시간을 자동으로 읽어드려요'}
                  {scanStep === 'scanning' && 'OCR로 텍스트 추출 중이에요'}
                  {scanStep === 'result' && '틀린 부분을 탭해서 수정하세요'}
                </p>
              </div>
              {scanStep !== 'scanning' && (
                <button
                  onClick={() => setShowScan(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors text-brand-body shrink-0 ml-3"
                >
                  {CLOSE_BTN}
                </button>
              )}
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
              {scanStep === 'idle' && <ImageUploader onFileSelect={handleFileSelect} />}
              {scanStep === 'scanning' && <ScanProgress progress={scanProgress} imagePreview={preview} />}
              {scanStep === 'result' && parsed && (
                <OcrResultForm parsed={parsed} onConfirm={handleConfirm} onRescan={handleRescan} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 직접 입력 모달 ── */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowManual(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-5 py-4 flex items-center justify-between border-b border-brand-border shrink-0">
              <div>
                <p className="font-black text-base text-brand-black">직접 항공편 입력</p>
                <p className="text-xs text-brand-muted mt-0.5">항공편 정보를 직접 입력해주세요</p>
              </div>
              <button
                onClick={() => setShowManual(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors text-brand-body shrink-0 ml-3"
              >
                {CLOSE_BTN}
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1">
              <OcrResultForm parsed={{}} onConfirm={handleConfirm} onRescan={() => setShowManual(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
