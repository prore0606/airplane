const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const SYSTEM_PROMPT = `너는 인천국제공항 전문 AI 도우미 "에어봇"이야.
공항 이용객들이 출국 과정에서 궁금한 것들을 친절하고 간결하게 안내해줘.
반말 금지, 존댓말로 답변해. 이모지 적절히 사용해서 친근하게.
답변은 반드시 완결된 문장으로 끝내고, 내용은 충분히 친절하고 상세하게 안내해줘.

[인천공항 주요 시설 정보]
■ 제1터미널(T1)
- 체크인: 3층 출발층 (A~M 카운터)
- 보안검색: 3층 출발층
- 출국심사: 3층
- 면세구역: 4층 (탑승구 지역)
- 식당가: 3층 외부, 4층 면세구역 내
- 편의점: CU, GS25 (3층, 4층)
- 환전: 1층 3·5·7번 게이트 앞, 3층 출발층
- ATM: 1층, 3층 곳곳
- 약국: 3층 출발층 내
- 수하물 보관: 1층 입국장 옆
- 라운지: 4층 면세구역 (마티나, 스카이허브 등)
- 카드사 무료 라운지: 현대카드·신한카드·삼성카드 제휴 라운지 있음
- 셔틀트레인: 탑승동(탑승구 101~132) 이동 시 이용

■ 제2터미널(T2)
- 대한항공, 델타, 에어프랑스, KLM 이용
- 체크인: 3층 출발층
- 면세구역: 4층
- 식당가: 3층, 4층
- 환전: 3층 출발층

■ T1 ↔ T2 이동
- 셔틀버스: 1층 출구에서 무료, 약 15-18분

■ 주차
- 단기: 1층 주차장 (비쌈)
- 장기: 장기주차장 (저렴, 셔틀버스 운행)
- 발렛: 맥서브 사전예약 필수

■ 수속 팁
- 국제선 출발 3시간 전 도착 권장
- 보안검색: 노트북·액체류 분리, 신발 벗기 없음
- 출국심사: 자동출입국심사대 이용 시 빠름 (등록 필요)
- 면세점 픽업: 출국심사 후 4층 면세구역에서 수령

이 정보를 바탕으로 사용자 질문에 답변해줘.`

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

// 사용 가능한 모델 순서대로 시도
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
]

// 디버그: 사용 가능한 모델 목록 출력
export async function listAvailableModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  )
  const data = await res.json()
  console.log('사용 가능한 모델:', data)
  return data
}

async function tryFetch(model: string, body: object): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function sendMessage(
  messages: ChatMessage[],
  userMessage: string,
  context?: string,
): Promise<string> {
  const systemText = context
    ? `${SYSTEM_PROMPT}\n\n[현재 사용자 상태]\n${context}`
    : SYSTEM_PROMPT

  const contents = [
    ...messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  const body = {
    system_instruction: { parts: [{ text: systemText }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  }

  let lastError = ''
  for (const model of MODELS) {
    try {
      const res = await tryFetch(model, body)
      if (res.ok) {
        const data = await res.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '죄송해요, 다시 시도해 주세요.'
      }
      const errData = await res.json().catch(() => ({}))
      lastError = `${model}: ${res.status} ${JSON.stringify(errData)}`
      console.warn('모델 실패, 다음 시도:', lastError)
    } catch (e) {
      lastError = String(e)
      console.warn('요청 실패:', lastError)
    }
  }

  throw new Error(lastError)
}
