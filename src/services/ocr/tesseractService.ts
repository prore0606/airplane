import { createWorker } from 'tesseract.js'

export interface OcrResult {
  text: string
  confidence: number
}

/**
 * 단일 책임: 이미지 파일을 받아 텍스트 추출만 담당
 * 파싱 로직은 boardingPassParser.ts 에서 처리
 */
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (pct: number) => void,
): Promise<OcrResult> {
  const worker = await createWorker('eng+kor', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  try {
    const { data } = await worker.recognize(imageFile)
    return {
      text: data.text,
      confidence: data.confidence,
    }
  } finally {
    await worker.terminate()
  }
}
