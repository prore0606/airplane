/**
 * 단일 책임: OCR 추출 텍스트에서 탑승권 정보만 파싱
 * Tesseract / UI / API 호출과 완전히 분리
 */

export interface BoardingPassInfo {
  flightNumber:  string   // KE723
  airline:       string   // 대한항공
  origin:        string   // ICN
  destination:   string   // NRT
  date:          string   // 2026-04-03
  departureTime: string   // 13:40  — 출발시각
  boardingTime:  string   // 12:55  — 탑승시각 (보통 출발 40~45분 전)
  terminal:      string   // T1
  gate:          string   // G23
  seat:          string   // 12A
}

export type ParsedBoardingPass = Partial<BoardingPassInfo>

// 항공사 코드 → 한글 이름
const AIRLINE_NAMES: Record<string, string> = {
  KE: '대한항공',    OZ: '아시아나항공', LJ: '진에어',
  '7C': '제주항공',  TW: '티웨이항공',   BX: '에어부산',
  RS: '에어서울',    ZE: '이스타항공',   NH: '전일본공수',
  JL: '일본항공',    SQ: '싱가포르항공', CX: '캐세이퍼시픽',
  TG: '타이항공',    QR: '카타르항공',   EK: '에미레이트',
}

/**
 * 항공사명 → 인천공항 터미널 자동 매핑
 * 대한항공 계열: T1 / LCC 일부: T2 / 아시아나 계열: T1
 */
export const AIRLINE_TERMINAL: Record<string, string> = {
  '대한항공':     'T1',
  '아시아나항공': 'T1',
  '진에어':       'T2',
  '제주항공':     'T1',
  '티웨이항공':   'T1',
  '에어부산':     'T2',
  '에어서울':     'T1',
  '이스타항공':   'T1',
}

/** 편명 추출: KE723, OZ101 등 */
function parseFlightNumber(text: string): string {
  const m = text.match(/\b([A-Z]{2})\s*(\d{3,4})\b/)
  return m ? `${m[1]}${m[2]}` : ''
}

/** 항공사 코드 추출 후 한글명 반환 */
function parseAirline(_text: string, flightNumber: string): string {
  const code = flightNumber.slice(0, 2)
  return AIRLINE_NAMES[code] ?? code
}

/** 공항 IATA 코드 추출 */
function parseAirportCodes(text: string): { origin: string; destination: string } {
  const known = ['ICN', 'GMP', 'PUS', 'CJU', 'NRT', 'HND', 'KIX', 'OSA',
    'TPE', 'BKK', 'SIN', 'HKG', 'PEK', 'PVG', 'LAX', 'JFK', 'LHR', 'CDG']
  const found = [...new Set(text.match(/\b[A-Z]{3}\b/g) ?? [])].filter((c) => known.includes(c))
  return { origin: found[0] ?? 'ICN', destination: found[1] ?? '' }
}

/** 시간 추출 (HH:MM) — 여러 개 중 첫/두번째 구분 */
function parseTimes(text: string): { departureTime: string; boardingTime: string } {
  const times = [...text.matchAll(/\b(\d{1,2}):(\d{2})\b/g)].map(
    (m) => `${m[1].padStart(2, '0')}:${m[2]}`
  )
  // 탑승시각은 대개 출발시각보다 앞 → 두 개 이상이면 작은 게 탑승, 큰 게 출발
  if (times.length >= 2) {
    const sorted = [...times].sort()
    return { boardingTime: sorted[0], departureTime: sorted[sorted.length - 1] }
  }
  return { departureTime: times[0] ?? '', boardingTime: '' }
}

/** 터미널 추출 */
function parseTerminal(text: string): string {
  const m = text.match(/\bT(?:erminal\s*)?([12])\b/i)
  return m ? `T${m[1]}` : ''
}

/** 게이트 추출: G23, A14 등 */
function parseGate(text: string): string {
  const m = text.match(/\b(?:Gate\s*)?([A-Z]\d{1,2})\b/i)
  return m ? m[1].toUpperCase() : ''
}

/** 좌석 추출: 12A, 3C, 24F 등 */
function parseSeat(text: string): string {
  const m = text.match(/\b(\d{1,2}[A-F])\b/)
  return m ? m[1].toUpperCase() : ''
}

/** 날짜 추출 */
function parseDate(text: string): string {
  const iso = text.match(/\b(\d{4})[.\-/](\d{2})[.\-/](\d{2})\b/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const months: Record<string, string> = {
    JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',
    JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12',
  }
  const abbr = text.match(/\b(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/i)
  if (abbr) {
    const year = new Date().getFullYear()
    return `${year}-${months[abbr[2].toUpperCase()]}-${abbr[1].padStart(2, '0')}`
  }
  return ''
}

/** 메인 파싱 함수 */
export function parseBoardingPass(ocrText: string): ParsedBoardingPass {
  const text = ocrText.toUpperCase()
  const flightNumber = parseFlightNumber(text)
  const airline      = parseAirline(text, flightNumber)
  const { origin, destination } = parseAirportCodes(text)
  const { departureTime, boardingTime } = parseTimes(ocrText)

  // 터미널: OCR에서 먼저 시도 → 없으면 항공사로 자동 추론
  const terminalFromOcr = parseTerminal(text)
  const terminal = terminalFromOcr || AIRLINE_TERMINAL[airline] || ''

  return {
    flightNumber,
    airline,
    origin,
    destination,
    date:          parseDate(ocrText),
    departureTime,
    boardingTime,
    terminal,
    gate:          parseGate(text),
    seat:          parseSeat(text),
  }
}
