const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`

const SYSTEM_PROMPT = `너는 인천국제공항 전문 AI 도우미 "에어봇"이야.
공항 이용객들이 출국 과정에서 궁금한 것들을 친절하고 간결하게 안내해줘.
반말 금지, 존댓말로 답변해. 이모지 적절히 사용해서 친근하게.
답변은 3-4문장 이내로 짧고 명확하게.

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

export async function sendMessage(
  messages: ChatMessage[],
  userMessage: string,
  context?: string,
): Promise<string> {
  const contents = [
    ...messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ]

  const systemInstruction = context
    ? `${SYSTEM_PROMPT}\n\n[현재 사용자 상태]\n${context}`
    : SYSTEM_PROMPT

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    console.error('Gemini API error:', response.status, errData)
    throw new Error(`Gemini API 오류: ${response.status}`)
  }

  const data = await response.json()
  console.log('Gemini response:', data)
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '죄송해요, 다시 시도해 주세요.'
}
