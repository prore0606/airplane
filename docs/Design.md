# AirMate (AI 출국 메이트) — Design System

> BX & UI Design Portfolio · WinAway 벤치마킹 · AI Travel Operations Platform  
> Platform: iOS / Android App · Target: 국내 출국자 · 인천공항  
> **CSS Framework: Tailwind CSS v3.4 (stable)**

---

## 00. Tailwind 설정

### 설치

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js

모든 커스텀 컬러와 폰트를 여기서 관리

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:   '#1DB954',  // Primary Green
          dark:    '#17a349',  // Green Dark
          pale:    '#E8F8EE',  // Green Pale
          mid:     '#B8E8C8',  // Green Mid
          black:   '#0F1410',  // Deep Black
          ink:     '#1A2420',  // Body Text Dark
          body:    '#4A5C50',  // Body Text
          muted:   '#8A9E92',  // Caption
          border:  '#E2ECE6',  // Border
          surface: '#F6FAF7',  // App Background
          red:     '#FF4757',  // Alert Red
          orange:  '#FF8C42',  // Warning Orange
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],  // 영문 타이틀
        sans:    ['Noto Sans KR', 'sans-serif'], // 기본 본문
      },
      borderRadius: {
        'card':  '14px',
        'hero':  '20px',
        'pill':  '100px',
      },
    },
  },
  plugins: [],
}
```

### globals.css (Google Fonts + Tailwind base)

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Montserrat:wght@700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 01. Color System

출발과 자연의 의지하는 그린을 메인 컬러로 설정

| HEX | 이름 | Tailwind 클래스 | 용도 |
|-----|------|-----------------|------|
| `#1DB954` | **Primary Green** | `bg-brand-green` / `text-brand-green` | 메인 CTA · 브랜드 포인트 |
| `#0F1410` | **Deep Black** | `bg-brand-black` / `text-brand-black` | 히어로 배경 · 강조 텍스트 |
| `#F6FAF7` | **Surface Gray** | `bg-brand-surface` | 앱 배경 · 카드 서피스 |
| `#E8F8EE` | **Green Pale** | `bg-brand-pale` | 배지 · 체크리스트 배경 |
| `#FF4757` | **Alert Red** | `bg-brand-red` / `text-brand-red` | 지연 · 결항 · 위험 알림 |
| `#FF8C42` | **Warning Orange** | `bg-brand-orange` / `text-brand-orange` | 주의 · 마감 임박 알림 |
| `#8A9E92` | **Muted** | `text-brand-muted` | 캡션 · 플레이스홀더 |
| `#E2ECE6` | **Border** | `border-brand-border` | 카드 테두리 · 구분선 |

---

## 02. Typography

**Montserrat** (Display / Heading) + **Noto Sans KR** (Body) 이중 타입 시스템

| 스타일 | 폰트 | Tailwind 클래스 | 용도 |
|--------|------|-----------------|------|
| Display | Montserrat 900 | `font-display font-black text-5xl tracking-tight` | 앱 타이틀, 히어로 배너 |
| Heading 1 | Montserrat 800 | `font-display font-extrabold text-3xl tracking-tight` | 주요 화면 제목 |
| Heading 2 | Noto Sans KR 700 | `font-sans font-bold text-xl` | 섹션 헤더 |
| Body | Noto Sans KR 400 | `font-sans font-normal text-base leading-relaxed` | 일반 본문 |
| Caption | Noto Sans KR 400 | `font-sans font-normal text-xs` | 보조 설명, 메타 정보 |
| Label | Noto Sans KR 700 | `font-sans font-bold text-[11px] uppercase tracking-widest` | 태그, 배지 |

---

## 03. Icon System

서비스 전반에 사용되는 기능 아이콘 세트 (24종)

| 아이콘 | 이름 | | 아이콘 | 이름 |
|--------|------|-|--------|------|
| ✈️ | 항공편 | | 🛋️ | 라운지 |
| 🅿️ | 주차 | | 🍽️ | 식당 |
| ✅ | 체크리스트 | | 🛍️ | 면세점 |
| 📍 | 위치 | | 🏧 | ATM |
| 🔔 | 알림 | | 📱 | 환전 |
| 🧭 | 내비 | | 🚶 | 전사 |
| 🗺️ | 지도 | | 🚌 | 셔틀 |
| 🎮 | 캐릭터 | | 📔 | 여권 |
| 🚻 | 화장실 | | 🏆 | 배지 |
| 🧳 | 수하물 | | 📸 | 스캔 |
| ⏱️ | 타이머 | | 🤝 | 친구 |
| 🏠 | 홈 | | 🚗 | 차량 |

---

## 04. Bottom Tab Navigation

| 순서 | 아이콘 | 탭 이름 | 주요 기능 |
|------|--------|---------|-----------|
| 1 | 🏠 | **홈** | 항공편 히어로 카드, 공항 시설 바로가기 |
| 2 | ✈️ | **항공편** | 항공권 스캔 / OCR 등록, 실시간 상태 |
| 3 | 🗺️ | **지도** | 공항 지도, 체크리스트, 출국 타이밍 안내 |
| 4 | 🎮 | **캐릭터** | 캐릭터 레벨업, 배지, 게임화 요소 |
| 5 | 🤝 | **MY** | 마이페이지, 친구 초대, 여행 기록 |

> **참고**: 친구 기능은 MY 탭 내부 메뉴로 포함

### Tab Item 컴포넌트 (React + Tailwind)

```tsx
// 비활성 탭
<div className="flex-1 flex flex-col items-center gap-1 py-2">
  <span className="text-lg">✈️</span>
  <span className="text-[9px] font-medium text-brand-muted">항공편</span>
</div>

// 활성 탭
<div className="flex-1 flex flex-col items-center gap-1 py-2">
  <span className="text-lg">🏠</span>
  <span className="text-[9px] font-bold text-brand-green">홈</span>
  <div className="w-1 h-1 rounded-full bg-brand-green" />
</div>
```

---

## 05. App Screens

WinAway 구조 벤치마킹 기반 주요 화면 5종

### Screen 1 — 홈 (메인)
- 상단: 로고 + 알림 버튼
- 인사말: `김민준님, D-2 출국 준비됐나요?`
- **항공편 히어로 카드** (다크 그린 그라디언트)
- **미니 카드 2열**: 보안검색 대기 / 내 차 위치
- 공항 내 시설 가로 스크롤 칩

### Screen 2 — 항공권 스캔
- 스캔 히어로 영역 (대시 테두리 + 카메라 안내)
- 입력 옵션 4가지: 갤러리, 카카오톡, 이메일, PDF
- OCR 인식 결과 카드

### Screen 3 — 체크리스트
- 준비 진행률 프로그레스 바 (8/12)
- 필수 서류 / 짐 체크 그룹

### Screen 4 — 주차 GPS 저장
- 지도 미리보기 + 저장된 위치 카드
- 예상 요금 / 할인 정보

### Screen 5 — 마이페이지
- 프로필 카드 (다크 배경) + 통계
- 캐릭터 XP 카드
- 메뉴 목록 (여행기록, 알림설정, 여권관리, 친구)

---

## 06. Service Flow (7단계)

```
📸 스캔 → ✅ 체크리스트 → 🕐 타이밍 → 🅿️ 주차저장 → ✈️ 실시간 → 🧭 내비 → 🏠 귀가
```

| 단계 | 기능 | 설명 |
|------|------|------|
| 1 | 항공권 스캔 | OCR 자동 인식으로 항공편 정보 등록 |
| 2 | 체크리스트 생성 | AI가 여행 목적지/기간 맞춤 준비물 제안 |
| 3 | 출발 타이밍 | 최적 출발 시간 및 보안검색 경로 안내 |
| 4 | 주차 GPS 저장 | 귀국 후 차 찾기를 위한 위치 저장 |
| 5 | 항공편 실시간 | 지연, 게이트 변경 알림 푸시 |
| 6 | AI 내비 추천 | 면세점 · 라운지 · 식당 동선 추천 |
| 7 | 귀국 · 귀가 | 주차 위치 안내 및 귀가 교통편 안내 |

---

## 07. Component Library (Tailwind 클래스)

### Alert & Notification

```tsx
// Success
<div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-pale border border-brand-mid">
  <span className="text-base mt-0.5">✅</span>
  <div>
    <p className="text-xs font-bold text-brand-black mb-0.5">체크인 완료</p>
    <p className="text-[11px] text-brand-body leading-relaxed">온라인 체크인이 완료됐습니다.</p>
  </div>
</div>

// Warning
<div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
  <span className="text-base mt-0.5">⚠️</span>
  <div>
    <p className="text-xs font-bold text-brand-black mb-0.5">수하물 마감 30분 전</p>
    <p className="text-[11px] text-brand-body leading-relaxed">G카이터로 지금 이동하세요.</p>
  </div>
</div>

// Danger
<div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
  <span className="text-base mt-0.5">🚨</span>
  <div>
    <p className="text-xs font-bold text-brand-black mb-0.5">게이트 변경 알림</p>
    <p className="text-[11px] text-brand-body leading-relaxed">G12 → G8로 변경됐습니다.</p>
  </div>
</div>
```

### Buttons

```tsx
// Primary
<button className="bg-brand-green text-white font-bold text-sm px-5 py-3 rounded-xl">
  항공권 스캔
</button>

// Secondary
<button className="bg-brand-pale text-brand-dark font-bold text-sm px-5 py-3 rounded-xl border border-brand-mid">
  체크리스트
</button>

// Ghost
<button className="bg-transparent text-brand-body font-bold text-sm px-5 py-3 rounded-xl border border-brand-border">
  취소
</button>

// Danger
<button className="bg-red-50 text-brand-red font-bold text-sm px-5 py-3 rounded-xl border border-red-200">
  결항 보상 보기
</button>

// Small
<button className="bg-brand-green text-white font-bold text-xs px-3.5 py-2 rounded-xl">
  저장
</button>

// Full width
<button className="w-full bg-brand-green text-white font-bold text-sm py-3.5 rounded-xl">
  지금 이동하기 →
</button>
```

### Status Pills (태그)

```tsx
<span className="bg-brand-green text-white text-[11px] font-bold px-3.5 py-1 rounded-full">정시 출발</span>
<span className="bg-brand-pale text-brand-dark text-[11px] font-bold px-3.5 py-1 rounded-full">체크인 완료</span>
<span className="bg-white text-brand-body text-[11px] font-bold px-3.5 py-1 rounded-full border border-brand-border">대기 중</span>
<span className="bg-orange-50 text-brand-orange text-[11px] font-bold px-3.5 py-1 rounded-full">⚠️ 마감 임박</span>
<span className="bg-red-50 text-brand-red text-[11px] font-bold px-3.5 py-1 rounded-full">🚨 게이트 변경</span>
```

### Input Fields

```tsx
// 기본
<input
  className="w-full border border-brand-border rounded-[10px] px-3.5 py-2.5 text-sm font-sans text-brand-ink outline-none
             focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
  placeholder="KE 723"
/>
```

### Step Progress (탑승 5단계)

```tsx
// done: bg-brand-green text-white
// current: bg-brand-black text-white
// todo: bg-brand-border text-brand-muted

<div className="flex items-center">
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black bg-brand-green text-white">✓</div>
  <div className="flex-1 h-0.5 bg-brand-green" />
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black bg-brand-green text-white">✓</div>
  <div className="flex-1 h-0.5 bg-brand-border" />
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black bg-brand-black text-white">3</div>
  <div className="flex-1 h-0.5 bg-brand-border" />
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black bg-brand-border text-brand-muted">4</div>
  <div className="flex-1 h-0.5 bg-brand-border" />
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black bg-brand-border text-brand-muted">5</div>
</div>
// 라벨: 스캔 / 체크인 / 보안검색 / 게이트 / 탑승
```

---

## 08. Card & Surface 패턴 (Tailwind)

### Flight Hero Card (항공편 히어로 카드)

```tsx
// Tailwind의 bg-gradient-to-br로 표현, 정확한 색은 style 병행 사용
<div
  className="rounded-hero p-5 relative overflow-hidden"
  style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2a1e 100%)' }}
>
  {/* 우상단 그린 글로우 — Tailwind로 표현 불가, style 사용 */}
  <div
    className="absolute -top-1/3 -right-4 w-44 h-44 rounded-full pointer-events-none"
    style={{ background: 'radial-gradient(circle, rgba(29,185,84,.25), transparent 65%)' }}
  />
  {/* 내용 */}
</div>
```

### 일반 카드

```tsx
// 기본 카드
<div className="bg-white rounded-card border border-brand-border p-4">
  ...
</div>

// 강조 카드 (Green)
<div className="bg-brand-green rounded-card p-4">
  ...
</div>

// 서피스 카드 (연한 배경)
<div className="bg-brand-surface rounded-card border border-brand-border p-4">
  ...
</div>
```

### Profile Card (마이페이지)

```tsx
<div
  className="rounded-hero p-6 relative overflow-hidden"
  style={{ background: 'linear-gradient(135deg, #0f1410 0%, #1a2e20 100%)' }}
>
  ...
</div>
```

---

## 09. Logo & Brand Guidelines

### 로고 마크

```tsx
<div className="flex items-center gap-1.5">
  {/* 로고 아이콘 */}
  <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-sm">
    ✈
  </div>
  {/* 워드마크 */}
  <span className="font-display font-black text-[15px] tracking-tight text-brand-black">
    출국<span className="text-brand-green">메이트</span>
  </span>
</div>
```

### 브랜드 메타데이터

| 항목 | 내용 |
|------|------|
| 서비스명 | AI 출국 메이트 |
| 태그라인 | 항공권 스캔 한 번으로 시작되는 AI 사전 이동 플랫폼 |
| 플랫폼 | iOS / Android |
| 타깃 | 국내 출국자 · 인천공항 이용자 |
| 벤치마크 | WinAway App |
| CSS Framework | Tailwind CSS v3.4 (stable) |

---

*Design System v1.1 · AirMate (AI 출국 메이트) · Tailwind CSS v3.4*
