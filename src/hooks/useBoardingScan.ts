import { useState } from 'react'
import { extractTextFromImage } from '../services/ocr/tesseractService'
import { parseBoardingPass, type ParsedBoardingPass } from '../services/ocr/boardingPassParser'

export type ScanStep = 'idle' | 'scanning' | 'result'

export function useBoardingScan() {
  const [scanStep,     setScanStep]     = useState<ScanStep>('idle')
  const [scanProgress, setScanProgress] = useState(0)
  const [preview,      setPreview]      = useState<string | null>(null)
  const [parsed,       setParsed]       = useState<ParsedBoardingPass | null>(null)

  function handleRescan() {
    setScanStep('idle')
    setPreview(null)
    setParsed(null)
    setScanProgress(0)
  }

  async function handleFileSelect(file: File) {
    setPreview(URL.createObjectURL(file))
    setScanStep('scanning')
    setScanProgress(0)
    try {
      const { text } = await extractTextFromImage(file, setScanProgress)
      setScanProgress(100)
      setParsed(parseBoardingPass(text))
      setScanStep('result')
    } catch {
      setScanStep('idle')
      alert('이미지 인식에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return { scanStep, scanProgress, preview, parsed, handleFileSelect, handleRescan }
}
