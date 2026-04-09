import { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import ImageUploader from '../components/scan/ImageUploader'
import ScanProgress from '../components/scan/ScanProgress'
import OcrResultForm from '../components/scan/OcrResultForm'
import { extractTextFromImage } from '../services/ocr/tesseractService'
import { parseBoardingPass, type ParsedBoardingPass } from '../services/ocr/boardingPassParser'
import { useJourney } from '../context/JourneyContext'
import { useFlights } from '../hooks/useFlights'
import { parseDatetime, remarkColor, type Flight } from '../services/flightApi'

type ScanStep = 'idle' | 'scanning' | 'result'

export default function FlightPage() {
  const { setStage, setFlightRegistered } = useJourney()
  const { data: flights, loading } = useFlights()

  const [step, setStep] = useState<ScanStep>('idle')
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedBoardingPass | null>(null)

  async function handleFileSelect(file: File) {
    // 미리보기 생성
    setPreview(URL.createObjectURL(file))
    setStep('scanning')
    setProgress(0)

    try {
      const { text } = await extractTextFromImage(file, setProgress)
      setProgress(100)
      const result = parseBoardingPass(text)
      setParsed(result)
      setStep('result')
    } catch {
      setStep('idle')
      alert('이미지 인식에 실패했습니다. 다시 시도해주세요.')
    }
  }

  function handleRescan() {
    setStep('idle')
    setPreview(null)
    setParsed(null)
    setProgress(0)
  }

  function handleConfirm(info: ParsedBoardingPass) {
    setFlightRegistered(true)
    setStage('preparing')
    // TODO: Supabase 연동 후 DB 저장
    console.log('등록된 항공편 정보:', info)
    handleRescan()
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

          <div>
            <p className="text-xl font-bold text-brand-black">항공권 등록 · 실시간 운항</p>
            <p className="text-sm text-brand-muted mt-1">스캔하면 모든 여행 정보가 자동 연결됩니다</p>
          </div>

          <div className="grid grid-cols-2 gap-6">

            {/* 왼쪽: 스캔 영역 */}
            <div>
              {step === 'idle' && (
                <ImageUploader onFileSelect={handleFileSelect} />
              )}
              {step === 'scanning' && (
                <ScanProgress progress={progress} imagePreview={preview} />
              )}
              {step === 'result' && parsed && (
                <OcrResultForm
                  parsed={parsed}
                  onConfirm={handleConfirm}
                  onRescan={handleRescan}
                />
              )}
            </div>

            {/* 오른쪽: 실시간 출발 현황 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">실시간 출발 현황</p>
                {!loading && (
                  <span className="text-[10px] text-brand-green font-semibold bg-brand-pale px-2 py-0.5 rounded-pill">
                    ● LIVE
                  </span>
                )}
              </div>

              {loading && (
                <div className="bg-white border border-brand-border rounded-xl p-6 text-center">
                  <div className="text-2xl mb-2 animate-pulse">✈️</div>
                  <p className="text-sm text-brand-muted">운항 정보 로딩 중...</p>
                </div>
              )}

              {!loading && flights.map((f: Flight) => {
                const sched = parseDatetime(f.scheduleDatetime)
                const est = parseDatetime(f.estimatedDatetime)
                const delayed = f.scheduleDatetime !== f.estimatedDatetime
                const badgeCls = remarkColor(f.remark)

                return (
                  <div key={f.flightId}
                    className="bg-white border border-brand-border rounded-xl px-4 py-3.5 hover:border-brand-green transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-black text-sm text-brand-black">{f.flightId}</span>
                          <span className="text-xs text-brand-muted truncate">{f.airline}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                          <span>ICN</span>
                          <span className="text-brand-green text-xs">→</span>
                          <span>{f.airportCode}</span>
                          <span className="text-brand-muted font-normal text-xs ml-1">{f.airport}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill shrink-0 ${badgeCls}`}>
                        {f.remark}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-brand-border text-xs text-brand-muted">
                      <span>
                        출발{' '}
                        <span className={delayed ? 'line-through mr-1' : 'font-semibold text-brand-ink'}>
                          {sched.time}
                        </span>
                        {delayed && <span className="font-semibold text-brand-red">{est.time}</span>}
                      </span>
                      <span>{f.terminalId} · {f.gateNumber}게이트</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
