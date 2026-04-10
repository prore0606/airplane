import { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import { useJourney, STAGE_ORDER } from '../context/JourneyContext'
import { useFlightContext } from '../context/FlightContext'
import { useShuttle } from '../hooks/useShuttle'
import { useCongestion } from '../hooks/useCongestion'
import ChapterBar from '../components/journey/ChapterBar'
import CharacterCard from '../components/journey/CharacterCard'
import StageActions from '../components/journey/StageActions'
import StageExtras from '../components/journey/StageExtras'
import BoardingCountdown from '../components/journey/BoardingCountdown'
import ImageUploader from '../components/scan/ImageUploader'
import ScanProgress from '../components/scan/ScanProgress'
import OcrResultForm from '../components/scan/OcrResultForm'
import { NEXT_LABEL } from '../components/journey/stageConfig'
import { parseDatetime } from '../services/flightApi'
import { extractTextFromImage } from '../services/ocr/tesseractService'
import { parseBoardingPass, type ParsedBoardingPass } from '../services/ocr/boardingPassParser'

type ScanStep = 'idle' | 'scanning' | 'result'

/** 카운트다운을 표시할 단계 */
const COUNTDOWN_STAGES = new Set(['checkin', 'external', 'airside', 'boarding'])

export default function JourneyPage() {
  const { stage, setStage, setFlightRegistered } = useJourney()
  const { flights } = useFlightContext()
  const { data: shuttles } = useShuttle()
  const { data: congestion } = useCongestion()

  // 스캔 모달 상태
  const [showScan, setShowScan] = useState(false)
  const [scanStep, setScanStep] = useState<ScanStep>('idle')
  const [scanProgress, setScanProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedBoardingPass | null>(null)

  const nextLabel = NEXT_LABEL[stage] ?? ''
  const flight = flights[0]

  // HHMM 형태 추출
  const departureHHMM = flight
    ? (() => {
        const raw = flight.scheduleDatetime ?? ''
        if (raw.length <= 4) return raw
        const { time } = parseDatetime(raw)
        return time.replace(':', '')
      })()
    : null

  function handleNext() {
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[idx + 1])
  }

  /** 스캔 모달 열기 */
  function handleOpenScan() {
    setScanStep('idle')
    setScanProgress(0)
    setPreview(null)
    setParsed(null)
    setShowScan(true)
  }

  /** 이미지 첨부 → OCR 실행 */
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

  /** 확인 → 여정 시작 */
  function handleConfirm(info: ParsedBoardingPass) {
    setFlightRegistered(true)
    setStage('preparing')
    setShowScan(false)
    console.log('등록된 항공편:', info)
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
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          {stage !== 'no_ticket' && <ChapterBar stage={stage} />}

          <CharacterCard stage={stage} flight={flight} />

          {/* 탑승 카운트다운 */}
          {COUNTDOWN_STAGES.has(stage) && (
            <BoardingCountdown
              departureHHMM={departureHHMM}
              flightId={flight?.flightId}
            />
          )}

          <StageActions
            stage={stage}
            onScan={handleOpenScan}
            onNext={handleNext}
            nextLabel={nextLabel}
          />

          <StageExtras
            stage={stage}
            shuttles={shuttles}
            congestion={congestion}
            onReset={handleReset}
          />

        </div>
      </div>

      {/* ── 스캔 바텀시트 모달 ─────────────────────────── */}
      {showScan && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* 배경 딤 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => scanStep !== 'scanning' && setShowScan(false)}
          />

          {/* 시트 본체 */}
          <div className="relative bg-white rounded-t-[28px] max-h-[92vh] flex flex-col">

            {/* 핸들 바 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-brand-border rounded-pill" />
            </div>

            {/* 헤더 */}
            <div className="px-6 pb-3 flex items-center justify-between border-b border-brand-border">
              <div>
                <p className="font-black text-lg text-brand-black">항공권 스캔</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {scanStep === 'idle' && '사진을 첨부하면 AI가 정보를 자동으로 읽어드려요'}
                  {scanStep === 'scanning' && '항공권 정보를 인식하는 중이에요...'}
                  {scanStep === 'result' && '인식된 내용을 확인·수정하고 시작하세요'}
                </p>
              </div>
              {scanStep !== 'scanning' && (
                <button
                  onClick={() => setShowScan(false)}
                  className="text-brand-muted hover:text-brand-black text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 컨텐츠 */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              {scanStep === 'idle' && (
                <ImageUploader onFileSelect={handleFileSelect} />
              )}
              {scanStep === 'scanning' && (
                <ScanProgress progress={scanProgress} imagePreview={preview} />
              )}
              {scanStep === 'result' && parsed && (
                <OcrResultForm
                  parsed={parsed}
                  onConfirm={handleConfirm}
                  onRescan={handleRescan}
                />
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
