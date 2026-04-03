-- =============================================================
-- AirMate — SQL 스키마 정의서
-- PostgreSQL + Supabase 기준 | 총 14개 테이블
-- Supabase SQL Editor에 전체 복사 후 실행
-- =============================================================


-- -------------------------------------------------------------
-- 1. users — 회원 정보
--    Supabase Auth의 auth.users를 참조.
--    비밀번호 / 로그인 방식 / 소셜 ID는 Supabase Auth가 관리.
-- -------------------------------------------------------------
CREATE TABLE public.users (
    id            UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    fcm_token     TEXT,                                                         -- 푸시 알림 기기 식별값
    walking_speed VARCHAR(10)  CHECK (walking_speed IN ('slow','normal','fast')), -- AI 동선 추천용
    is_active     BOOLEAN      NOT NULL DEFAULT true,                           -- 탈퇴 시 false 처리
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 2. flights — 항공편 정보
--    항공사 정책값(수하물 규정, 체크인 오픈 시각 등)은 중복
--    저장을 피해 제거. actual_arr 추가.
--
--    [제거 항목]
--    airline_name       → 항공사 코드로 조회 가능
--    baggage_rule_json  → 항공사 정책값, 편마다 반복 저장 문제
--    checkin_open       → 항공사 정책값, 중복 저장 불필요
--    baggage_deadline_min → 동일한 이유로 제거
-- -------------------------------------------------------------
CREATE TABLE public.flights (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    flight_number    VARCHAR(10) NOT NULL,
    airline_code     VARCHAR(3)  NOT NULL,                    -- ex: KE, OZ
    origin_iata      VARCHAR(3)  NOT NULL,                    -- ex: ICN, GMP
    dest_iata        VARCHAR(3)  NOT NULL,                    -- ex: NRT
    terminal         VARCHAR(10),                             -- ex: T1, T2
    checkin_counter  VARCHAR(30),
    scheduled_dep    TIMESTAMPTZ NOT NULL,
    scheduled_arr    TIMESTAMPTZ NOT NULL,
    actual_dep       TIMESTAMPTZ,                             -- 지연 시 업데이트
    actual_arr       TIMESTAMPTZ,                             -- 원래 문서에서 누락, 추가
    status           VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                         CHECK (status IN ('scheduled','delayed','cancelled','departed')),
    gate             VARCHAR(10),
    ticket_image_url TEXT,                                    -- OCR용 항공권 이미지 저장 주소
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 3. flight_alert_settings — 항공편 알림 설정
--    user_id 제거 — flight_id로 항공편을 찾으면
--    누구의 설정인지 알 수 있어 완전 중복.
-- -------------------------------------------------------------
CREATE TABLE public.flight_alert_settings (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_id         UUID        NOT NULL REFERENCES public.flights(id) ON DELETE CASCADE,
    alert_delay       BOOLEAN     NOT NULL DEFAULT true,   -- 지연 알림
    alert_gate_change BOOLEAN     NOT NULL DEFAULT true,   -- 게이트 변경 알림
    alert_cancel      BOOLEAN     NOT NULL DEFAULT true,   -- 결항 알림
    alert_boarding    BOOLEAN     NOT NULL DEFAULT true,   -- 탑승 시작 알림
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 4. parking_records — 주차 기록
--    항공편과 독립적으로 관리.
--    주차 요금표는 코드에 상수로 처리.
-- -------------------------------------------------------------
CREATE TABLE public.parking_records (
    id            UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID             NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lat           DOUBLE PRECISION NOT NULL,   -- GPS 위도
    lng           DOUBLE PRECISION NOT NULL,   -- GPS 경도
    zone          VARCHAR(20),                 -- ex: A구역, P1
    floor         VARCHAR(10),                 -- ex: 1층, B2층
    lot_type      VARCHAR(20)      CHECK (lot_type IN ('short','long','indoor','outdoor')),
    parked_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
    retrieved_at  TIMESTAMPTZ,                 -- 출차 시각. 주차 중일 땐 NULL
    estimated_fee INTEGER,                     -- 예상 요금 (원)
    created_at    TIMESTAMPTZ      NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 5. airport_facilities — 공항 시설
--    면세점, 혼잡도, 시설 정보를 하나의 테이블로 커버.
--    관리자만 등록/수정/삭제 가능.
-- -------------------------------------------------------------
CREATE TABLE public.airport_facilities (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    airport_code     VARCHAR(3)   NOT NULL,                  -- ex: ICN, GMP
    terminal         VARCHAR(10)  NOT NULL,
    category         VARCHAR(30)  NOT NULL
                         CHECK (category IN (
                             'restaurant','pharmacy','lounge','atm',
                             'restroom','duty_free','sim','storage','checkin',
                             'security','immigration'
                         )),
    name             VARCHAR(100) NOT NULL,
    brand            VARCHAR(50),                            -- ex: 롯데, 신라, 현대
    floor            VARCHAR(10)  NOT NULL,
    location_desc    VARCHAR(200),
    open_time        TIME,
    close_time       TIME,
    congestion_level SMALLINT     CHECK (congestion_level BETWEEN 0 AND 5),
    wait_minutes     SMALLINT,                               -- 현재 대기 시간 (분)
    is_active        BOOLEAN      NOT NULL DEFAULT true,
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 6. checklists — 체크리스트
--    AI가 목적지·일정 기반으로 준비물을 자동 생성.
--    항공편과 독립적으로 관리.
-- -------------------------------------------------------------
CREATE TABLE public.checklists (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title           VARCHAR(100) NOT NULL,
    destination     VARCHAR(100),              -- ex: 도쿄, 방콕
    trip_days       SMALLINT,                  -- AI 추천 기준
    is_ai_generated BOOLEAN      NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 7. checklist_items — 체크리스트 항목
-- -------------------------------------------------------------
CREATE TABLE public.checklist_items (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID         NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    content      VARCHAR(200) NOT NULL,              -- ex: 여권 챙기기
    is_done      BOOLEAN      NOT NULL DEFAULT false,
    sort_order   SMALLINT     NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 8. notifications — 알림
--    항공편 이벤트 기반 푸시 알림 내역.
--    시스템 알림일 땐 flight_id = NULL.
-- -------------------------------------------------------------
CREATE TABLE public.notifications (
    id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    flight_id UUID         REFERENCES public.flights(id) ON DELETE SET NULL,
    type      VARCHAR(30)  NOT NULL
                  CHECK (type IN ('delay','gate_change','cancel','boarding','checkin','reminder')),
    title     VARCHAR(100) NOT NULL,
    body      TEXT         NOT NULL,
    is_read   BOOLEAN      NOT NULL DEFAULT false,
    sent_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 9. user_characters — 캐릭터
--    1명당 캐릭터 1개 → user_id를 PK로 사용.
--    누적 통계는 각 테이블에서 집계 계산.
--
--    [제거 항목]
--    total_steps      → pedometer_logs 에서 SUM 계산 가능
--    total_distance_m → pedometer_logs 에서 SUM 계산 가능
--    total_trips      → flights 에서 COUNT 계산 가능
-- -------------------------------------------------------------
CREATE TABLE public.user_characters (
    user_id    UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    level      SMALLINT    NOT NULL DEFAULT 1,
    exp        INTEGER     NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 10. badges — 배지 종류
--     획득 가능한 배지 종류 정의. 관리자가 미리 등록.
-- -------------------------------------------------------------
CREATE TABLE public.badges (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    code           VARCHAR(50)  NOT NULL UNIQUE,   -- ex: FIRST_TRIP, STEP_10000
    name           VARCHAR(100) NOT NULL,           -- ex: 첫 여행, 만보왕
    description    TEXT,
    condition_json JSONB
);


-- -------------------------------------------------------------
-- 11. user_badges — 유저가 획득한 배지
--     같은 배지 중복 획득 방지 (UNIQUE 제약).
-- -------------------------------------------------------------
CREATE TABLE public.user_badges (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id  UUID        NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, badge_id)
);


-- -------------------------------------------------------------
-- 12. pedometer_logs — 만보기 기록
--     공항 안에서 걸은 걸음 수와 이동 거리를 저장.
-- -------------------------------------------------------------
CREATE TABLE public.pedometer_logs (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    steps       INTEGER      NOT NULL,
    distance_m  INTEGER,                    -- 이동 거리 (미터)
    calories    DECIMAL(6,2),               -- 소모 칼로리
    recorded_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- 13. friendships — 친구 관계
--     친구 요청, 수락, 위치 공유 설정 저장.
--     같은 두 사람이 중복 관계를 맺지 못하도록 UNIQUE 제약.
-- -------------------------------------------------------------
CREATE TABLE public.friendships (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id   UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    addressee_id   UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','accepted','blocked')),
    location_share BOOLEAN     NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (requester_id, addressee_id)
);


-- -------------------------------------------------------------
-- 14. invite_codes — 친구 초대 코드
--     친구 초대 링크/코드 생성 및 검증용.
--     원래 문서에서 누락됐던 테이블.
-- -------------------------------------------------------------
CREATE TABLE public.invite_codes (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code         VARCHAR(20) NOT NULL UNIQUE,   -- 친구에게 공유하는 고유 초대 코드
    requester_id UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires_at   TIMESTAMPTZ NOT NULL,
    is_used      BOOLEAN     NOT NULL DEFAULT false,   -- 한 번 쓰면 true로 변경
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
