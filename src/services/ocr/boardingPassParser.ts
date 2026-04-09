/**
 * 단일 책임: OCR 추출 텍스트에서 탑승권 정보만 파싱
 * Tesseract / UI / API 호출과 완전히 분리
 */

export interface BoardingPassInfo {
  flightNumber: string  // KE723
  airline: string       // 대한항공
  origin: string        // ICN
  destination: string   // NRT
  departureTime: string // 13:40
  terminal: string      // T1
  gate: string          // G23
  date: string          // 2026-04-03
}

export type ParsedBoardingPass = Partial<BoardingPassInfo>

// 항공사 코드 → 한글 이름
const AIRLINE_NAMES: Record<string, string> = {
  KE: '대한항공', OZ: '아시아나항공', LJ: '진에어',
  '7C': '제주항공', TW: '티웨이항공', BX: '에어부산',
  RS: '에어서울', ZE: '이스타항공', NH: '전일본공수',
  JL: '일본항공', SQ: '싱가포르항공', CX: '캐세이퍼시픽',
  TG: '타이항공', QR: '카타르항공', EK: '에미레이트',
}

/** 편명 추출: KE723, OZ101 등 */
function parseFlightNumber(text: string): string {
  const match = text.match(/\b([A-Z]{2})\s*(\d{3,4})\b/)
  if (!match) return ''
  return `${match[1]}${match[2]}`
}

/** 항공사 코드 추출 후 한글명 반환 */
function parseAirline(_text: string, flightNumber: string): string {
  const code = flightNumber.slice(0, 2)
  return AIRLINE_NAMES[code] ?? code
}

/** 공항 IATA 코드 추출: ICN, NRT, HND 등 3자리 대문자 */
function parseAirportCodes(text: string): { origin: string; destination: string } {
  const known = ['ICN', 'GMP', 'PUS', 'CJU', 'NRT', 'HND', 'KIX', 'OSA',
    'TPE', 'BKK', 'SIN', 'HKG', 'PEK', 'PVG', 'LAX', 'JFK', 'LHR', 'CDG']

  const found = [...new Set(text.match(/\b[A-Z]{3}\b/g) ?? [])]
    .filter((c) => known.includes(c))

  return {
    origin: found[0] ?? 'ICN',
    destination: found[1] ?? '',
  }
}

/** 시간 추출: 13:40, 09:20 등 */
function parseDepartureTime(text: string): string {
  const match = text.match(/\b(\d{1,2}):(\d{2})\b/)
  if (!match) return ''
  const hh = match[1].padStart(2, '0')
  return `${hh}:${match[2]}`
}

/** 터미널 추출: T1, T2, Terminal 1 등 */
function parseTerminal(text: string): string {
  const match = text.match(/\bT(?:erminal\s*)?([12])\b/i)
  return match ? `T${match[1]}` : ''
}

/** 게이트 추출: G23, A14, B34 등 */
function parseGate(text: string): string {
  const match = text.match(/\b(?:Gate\s*)?([A-Z]\d{1,2})\b/i)
  return match ? match[1].toUpperCase() : ''
}

/** 날짜 추출: 2026-04-03, 26APR, APR03 등 */
function parseDate(text: string): string {
  const iso = text.match(/\b(\d{4})[.\-/](\d{2})[.\-/](\d{2})\b/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`

  const months: Record<string, string> = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
  }
  const abbr = text.match(/\b(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/i)
  if (abbr) {
    const year = new Date().getFullYear()
    return `${year}-${months[abbr[2].toUpperCase()]}-${abbr[1].padStart(2, '0')}`
  }
  return ''
}

/** 메인 파싱 함수 — 단일 진입점 */
export function parseBoardingPass(ocrText: string): ParsedBoardingPass {
  const text = ocrText.toUpperCase()
  const flightNumber = parseFlightNumber(text)
  const { origin, destination } = parseAirportCodes(text)

  return {
    flightNumber,
    airline: parseAirline(text, flightNumber),
    origin,
    destination,
    departureTime: parseDepartureTime(ocrText),
    terminal: parseTerminal(text),
    gate: parseGate(text),
    date: parseDate(ocrText),
  }
}
