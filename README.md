<div align="center">

# ✈ AirMate — AI 출국 메이트

**항공권 스캔 한 번으로 시작되는 AI 기반 출국 이동 플랫폼**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)

</div>

---

## 📌 프로젝트 개요

AirMate는 인천공항 출국자를 위한 AI 기반 여행 동반자 앱입니다.  
항공권을 OCR로 스캔하면 체크리스트, 실시간 항공편 알림, 주차 위치 저장까지 자동으로 연결됩니다.

> 📄 상세 기획 → [`docs/Read.md`](docs/Read.md)  
> 🎨 디자인 시스템 → [`docs/Design.md`](docs/Design.md)  
> 📋 PRD → [`docs/PRD.md`](docs/PRD.md)  
> 🔌 API 명세 → [`docs/API.md`](docs/API.md)

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v3.4 |
| Bundler | Vite 8 |
| Backend (예정) | Supabase (PostgreSQL + Auth) |
| OCR | 카카오 클로바 / Google Vision API |
| Push | Firebase Cloud Messaging |
| Data | 공공데이터포털 인천공항 API |

---

## 🚀 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 API 키 입력

# 3. 개발 서버 실행
npm run dev
```

---

## 📁 프로젝트 구조

```
airplane/
├── docs/                   # 기획 문서
│   ├── PRD.md             # 제품 요구사항 정의서
│   ├── Design.md          # 디자인 시스템
│   ├── API.md             # API 명세서
│   ├── database.sql       # DB 스키마
│   ├── Read.md            # 서비스 기획서
│   └── ProductBrief.md    # 제품소개서
├── src/
│   ├── pages/             # 화면 (홈, 항공편, 지도, 캐릭터, MY)
│   ├── components/        # 공통 UI 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── services/          # API / 외부 서비스 연동
│   └── types/             # TypeScript 타입 정의
└── .github/               # PR·이슈 템플릿
```

---

## 🌿 브랜치 전략

```
main         ← 배포 브랜치 (직접 push 금지)
dev          ← 통합 개발 브랜치
feature/*    ← 기능 개발 (예: feature/home-screen)
fix/*        ← 버그 수정
```

---

## 💬 커밋 컨벤션

```
feat:     새로운 기능 추가
fix:      버그 수정
design:   UI/스타일 변경
docs:     문서 수정
refactor: 리팩토링
chore:    빌드·설정 변경
```

---

## 👥 팀

| 역할 | 담당 |
|------|------|
| PM / 기획 | - |
| Frontend | - |
| Backend | - |
| Design | - |

---

<div align="center">
  <sub>Benchmark: WinAway App · 공공데이터포털 인천공항 API</sub>
</div>
