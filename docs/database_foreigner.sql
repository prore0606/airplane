-- =============================================================
-- 외국인 버전 (Foreigner Mode) DB 확장 스키마
-- 기존 database.sql 실행 후 이 파일을 추가로 실행
-- Supabase SQL Editor에 전체 복사 후 실행
-- =============================================================
-- 추가/수정 목록:
--   [수정] users           → user_mode, language 컬럼 추가
--   [수정] airport_facilities → name_en 컬럼 추가
--   [신규] stations        → MVP 5개 역
--   [신규] routes          → 4개 루트 × 양방향 = 8개
--   [신규] route_steps     → 텍스트 기반 (photo_url = NULL 유지)
-- =============================================================


-- -------------------------------------------------------------
-- [1] 기존 users 테이블 수정
--     user_mode: 내국인/외국인 앱 모드
--     language:  외국인 모드 언어 선택 (en/ja/zh)
-- -------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS user_mode VARCHAR(10) NOT NULL DEFAULT 'korean'
      CHECK (user_mode IN ('korean', 'foreigner')),
  ADD COLUMN IF NOT EXISTS language  VARCHAR(5)  NOT NULL DEFAULT 'ko'
      CHECK (language IN ('ko', 'en', 'ja', 'zh'));


-- -------------------------------------------------------------
-- [2] 기존 airport_facilities 테이블 수정
--     name_en: 영어 시설명 (외국인에게 표시)
-- -------------------------------------------------------------
ALTER TABLE public.airport_facilities
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(100);


-- -------------------------------------------------------------
-- [3] stations — 역 목록 (MVP 5개)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stations (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    code       VARCHAR(10)  NOT NULL UNIQUE,     -- ex: ICN-T1
    name_en    VARCHAR(100) NOT NULL,
    name_ko    VARCHAR(100) NOT NULL,
    line_info  VARCHAR(100),                     -- ex: AREX / Line 1 · 4
    icon       VARCHAR(10),
    sort_order SMALLINT     NOT NULL DEFAULT 0
);

INSERT INTO public.stations (id, code, name_en, name_ko, line_info, icon, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'ICN-T1',  'Incheon Airport T1',     '인천공항 1터미널', 'AREX',               '✈️', 1),
  ('00000000-0000-0000-0000-000000000002', 'ICN-T2',  'Incheon Airport T2',     '인천공항 2터미널', 'AREX',               '✈️', 2),
  ('00000000-0000-0000-0000-000000000003', 'SEOUL',   'Seoul Station',          '서울역',          'Line 1 · 4 · AREX', '🚉', 3),
  ('00000000-0000-0000-0000-000000000004', 'HONGDAE', 'Hongik University Stn.', '홍대입구',        'Line 2 · AREX',     '🎵', 4),
  ('00000000-0000-0000-0000-000000000005', 'MYEONG',  'Myeongdong Station',     '명동역',          'Line 4',            '🛍️', 5);


-- -------------------------------------------------------------
-- [4] routes — 역간 루트 (4개 × 양방향 = 8개)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routes (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    from_station_id  UUID         NOT NULL REFERENCES public.stations(id),
    to_station_id    UUID         NOT NULL REFERENCES public.stations(id),
    transport_method VARCHAR(100) NOT NULL,      -- ex: AREX Express
    duration_min     SMALLINT     NOT NULL,
    price_krw        INTEGER,
    total_steps      SMALLINT,                   -- 총 안내 스텝 수
    is_active        BOOLEAN      NOT NULL DEFAULT true,
    UNIQUE (from_station_id, to_station_id)
);

INSERT INTO public.routes
    (id, from_station_id, to_station_id, transport_method, duration_min, price_krw, total_steps)
VALUES
  -- ICN T1 ↔ Seoul Station (AREX Express)
  ('00000000-0000-0001-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000003',
   'AREX Express', 52, 9500, 7),

  ('00000000-0000-0001-0000-000000000002',
   '00000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'AREX Express', 52, 9500, 7),

  -- ICN T1 ↔ Hongik Univ. (AREX All-stop)
  ('00000000-0000-0001-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000004',
   'AREX All-stop', 66, 4250, 7),

  ('00000000-0000-0001-0000-000000000004',
   '00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'AREX All-stop', 66, 4250, 7),

  -- Seoul Station ↔ Myeongdong (Line 4)
  ('00000000-0000-0001-0000-000000000005',
   '00000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000005',
   'Line 4', 5, 1500, 6),

  ('00000000-0000-0001-0000-000000000006',
   '00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000003',
   'Line 4', 5, 1500, 6),

  -- Hongik Univ. ↔ Myeongdong (Line 2 + Line 4)
  ('00000000-0000-0001-0000-000000000007',
   '00000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000005',
   'Line 2 + Line 4', 40, 1500, 9),

  ('00000000-0000-0001-0000-000000000008',
   '00000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000004',
   'Line 4 + Line 2', 40, 1500, 9);


-- -------------------------------------------------------------
-- [5] route_steps — 스텝별 안내 (photo_url = NULL)
--     direction 범례: ↑ 직진  ↗ 우측  ↙ 좌측  ↓ 계단/에스컬 하강  → 안내 행동  ✓ 도착
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.route_steps (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id       UUID         NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    step_number    SMALLINT     NOT NULL,
    location_stamp VARCHAR(100) NOT NULL,        -- 화면 좌상단 위치 표시
    direction      VARCHAR(5)   NOT NULL,        -- 화살표 방향 기호
    instruction_en VARCHAR(200) NOT NULL,
    instruction_ja VARCHAR(200),
    instruction_zh VARCHAR(200),
    photo_url      TEXT,                         -- NULL = 미촬영 상태 (추후 업로드)
    distance_m     SMALLINT,
    UNIQUE (route_id, step_number)
);


-- =============================================================
-- ROUTE 1 : ICN T1 → Seoul Station  (AREX Express · 52 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000001', 1,
   'INCHEON T1 · ARRIVAL HALL',   '↑',
   'Exit customs — walk toward the "AREX / Train" signs',
   '税関を出たら「AREX / 鉄道」の案内板に向かって歩いてください',
   '出海关后，沿"AREX / 铁路"指示牌向前走', 40),

  ('00000000-0000-0001-0000-000000000001', 2,
   'INCHEON T1 · B1 CONCOURSE',   '↓',
   'Take escalator down to B1 floor (AREX station level)',
   'エスカレーターでB1フロア（AREX駅）へ降りてください',
   '乘扶梯下到B1层（AREX车站层）', NULL),

  ('00000000-0000-0001-0000-000000000001', 3,
   'INCHEON · AREX TICKET',       '→',
   'Buy AREX Express ticket at the machine (₩9,500) · Press "English" first',
   '自動券売機でAREX急行チケット購入（₩9,500）· まず「English」を押す',
   '在自动售票机购买AREX快车票（₩9,500）· 先按"English"', NULL),

  ('00000000-0000-0001-0000-000000000001', 4,
   'AREX · PLATFORM',             '↑',
   'Go through gate — board the train toward Seoul Station',
   '改札を通り、ソウル駅方面の列車に乗車してください',
   '过闸机，乘坐开往首尔站方向的列车', NULL),

  ('00000000-0000-0001-0000-000000000001', 5,
   'ON AREX · EXPRESS TRAIN',     '→',
   'Ride ~43 minutes · No stops — direct to Seoul Station',
   '約43分乗車 · 途中停車なし — ソウル駅直行',
   '乘车约43分钟 · 直达无停靠 — 直达首尔站', NULL),

  ('00000000-0000-0001-0000-000000000001', 6,
   'SEOUL STN · AREX PLATFORM',   '↑',
   'Exit the train · Follow "Seoul Station / Exit" signs upward',
   '列車を降りる · 「ソウル駅 / 出口」の案内に従って上へ',
   '下车 · 按"首尔站 / 出口"指示向上走', NULL),

  ('00000000-0000-0001-0000-000000000001', 7,
   'SEOUL STN · STREET LEVEL',    '✓',
   'Take any exit to street level · You''ve arrived at Seoul Station!',
   'お好きな出口から地上へ · ソウル駅に到着しました！',
   '从任意出口到达地面 · 您已到达首尔站！', 30);


-- =============================================================
-- ROUTE 2 : Seoul Station → ICN T1  (AREX Express · 52 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000002', 1,
   'SEOUL STN · MAIN HALL',       '→',
   'Inside Seoul Station — find the "AREX" or "Airport Railroad" signs',
   'ソウル駅構内で「AREX」または「空港鉄道」の案内板を探す',
   '在首尔站内找"AREX"或"机场铁路"指示牌', NULL),

  ('00000000-0000-0001-0000-000000000002', 2,
   'SEOUL STN · AREX ENTRANCE',   '↓',
   'Go down to the AREX level · Buy Express ticket (₩9,500)',
   'AREXフロアへ降りる · 急行チケット購入（₩9,500）',
   '下到AREX层 · 购买快车票（₩9,500）', NULL),

  ('00000000-0000-0001-0000-000000000002', 3,
   'SEOUL STN · AREX TICKET',     '→',
   'Press "English" on the machine · Select "Incheon Airport T1"',
   '券売機で「English」→「仁川空港 T1」を選択',
   '在售票机按"English" → 选择"仁川机场T1"', NULL),

  ('00000000-0000-0001-0000-000000000002', 4,
   'AREX · PLATFORM',             '↑',
   'Go through gate — board AREX Express toward Incheon Airport',
   '改札を通り、仁川空港方面のAREX急行に乗車',
   '过闸机，乘坐开往仁川机场的AREX快车', NULL),

  ('00000000-0000-0001-0000-000000000002', 5,
   'ON AREX · EXPRESS TRAIN',     '→',
   'Ride ~43 minutes · No stops — direct to Incheon Airport T1',
   '約43分乗車 · 途中停車なし — 仁川空港T1直行',
   '乘车约43分钟 · 直达无停靠 — 直达仁川机场T1', NULL),

  ('00000000-0000-0001-0000-000000000002', 6,
   'ICN T1 · AREX PLATFORM',      '↑',
   'Exit the train · Follow "Departures / 출발" signs upward',
   '列車を降りる · 「Departures / 出発」の案内に従って上へ',
   '下车 · 按"Departures / 出发"指示向上走', NULL),

  ('00000000-0000-0001-0000-000000000002', 7,
   'ICN T1 · DEPARTURE HALL 3F',  '✓',
   'Reach 3F Departure Hall · Find your airline check-in counter!',
   '3F出発ホールへ · 航空会社のチェックインカウンターへ！',
   '到达3F出发大厅 · 找到您的航空公司值机柜台！', NULL);


-- =============================================================
-- ROUTE 3 : ICN T1 → Hongik Univ.  (AREX All-stop · 66 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000003', 1,
   'INCHEON T1 · ARRIVAL HALL',   '↑',
   'Exit customs — walk toward the "AREX / Train" signs',
   '税関を出たら「AREX / 鉄道」の案内板へ',
   '出海关后，沿"AREX / 铁路"指示牌向前走', 40),

  ('00000000-0000-0001-0000-000000000003', 2,
   'INCHEON T1 · B1 CONCOURSE',   '↓',
   'Take escalator down to B1 floor (AREX station level)',
   'エスカレーターでB1フロアへ降りる',
   '乘扶梯下到B1层', NULL),

  ('00000000-0000-0001-0000-000000000003', 3,
   'INCHEON · AREX TICKET',       '→',
   'Buy AREX All-stop ticket (₩4,250) · Press "English" · Select "Hongik University"',
   '一般列車チケット購入（₩4,250）· 「English」→「弘益大学」選択',
   '购买AREX普通车票（₩4,250）· 按"English" → 选择"弘大入口"', NULL),

  ('00000000-0000-0001-0000-000000000003', 4,
   'AREX · PLATFORM',             '↑',
   'Go through gate — board the All-stop train toward Seoul',
   '改札を通り、ソウル方面の一般（各駅停車）列車に乗車',
   '过闸机，乘坐开往首尔方向的普通停站列车', NULL),

  ('00000000-0000-0001-0000-000000000003', 5,
   'ON AREX · ALL-STOP TRAIN',    '→',
   'Ride ~66 min · Stops at multiple stations — stay on until Hongik Univ.',
   '約66分乗車 · 複数駅停車 — 弘益大学駅まで乗り続ける',
   '乘车约66分钟 · 多站停靠 — 坐到弘大入口站', NULL),

  ('00000000-0000-0001-0000-000000000003', 6,
   'HONGIK UNIV. STN · PLATFORM', '↑',
   'Exit the train at Hongik University Station',
   '弘益大学駅で下車',
   '在弘大入口站下车', NULL),

  ('00000000-0000-0001-0000-000000000003', 7,
   'HONGDAE · EXIT 3',            '✓',
   'Take Exit 3 to the main street · You''ve arrived at Hongdae!',
   '3番出口から地上へ · 弘大に到着しました！',
   '走3号出口到地面 · 您已到达弘大！', 20);


-- =============================================================
-- ROUTE 4 : Hongik Univ. → ICN T1  (AREX All-stop · 66 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000004', 1,
   'HONGDAE · STREET LEVEL',      '↓',
   'Find "AREX Airport Railroad" entrance near Exit 3',
   '3番出口付近で「AREX空港鉄道」の入口を探す',
   '在3号出口附近找"AREX机场铁路"入口', NULL),

  ('00000000-0000-0001-0000-000000000004', 2,
   'HONGDAE · AREX TICKET',       '→',
   'Buy AREX All-stop ticket to Incheon T1 (₩4,250) · Press "English"',
   '仁川空港T1行き一般チケット購入（₩4,250）· 「English」押',
   '购买到仁川机场T1的普通车票（₩4,250）· 按"English"', NULL),

  ('00000000-0000-0001-0000-000000000004', 3,
   'AREX · PLATFORM',             '↑',
   'Board the All-stop train toward Incheon Airport',
   '仁川空港方面の一般（各駅停車）列車に乗車',
   '乘坐开往仁川机场方向的普通停站列车', NULL),

  ('00000000-0000-0001-0000-000000000004', 4,
   'ON AREX · ALL-STOP TRAIN',    '→',
   'Ride ~66 min · Stay on until Incheon Airport T1 (last or 2nd-to-last stop)',
   '約66分乗車 · 仁川空港T1まで乗り続ける（終点または終点の一つ前）',
   '乘车约66分钟 · 坐到仁川机场T1（终点或倒数第二站）', NULL),

  ('00000000-0000-0001-0000-000000000004', 5,
   'ICN T1 · AREX PLATFORM',      '↑',
   'Exit at Incheon Airport T1 · Follow "Departures" signs upward',
   '仁川空港T1で下車 · 「Departures / 出発」案内に従って上へ',
   '在仁川机场T1下车 · 按"Departures"指示向上走', NULL),

  ('00000000-0000-0001-0000-000000000004', 6,
   'ICN T1 · DEPARTURE HALL 3F',  '✓',
   'Reach 3F Departure Hall · Find your airline check-in counter. Have a great trip!',
   '3F出発ホールへ · チェックインカウンターへ。良い旅を！',
   '到达3F出发大厅 · 找到值机柜台。旅途愉快！', NULL),

  ('00000000-0000-0001-0000-000000000004', 7,
   'ICN T1 · CHECK-IN AREA',      '→',
   'Counters A–F on this floor · Check your boarding pass for counter number',
   '各チェックインカウンターはこのフロア · 搭乗券でカウンター番号を確認',
   '值机柜台A–F均在此层 · 查看登机牌上的柜台号', NULL);


-- =============================================================
-- ROUTE 5 : Seoul Station → Myeongdong  (Line 4 · 5 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000005', 1,
   'SEOUL STN · MAIN CONCOURSE',  '↓',
   'Inside station — find "Line 4" (blue line) signs and go down',
   '駅構内で「4号線（青）」の案内板を探して降りる',
   '在站内找"4号线（蓝色）"指示牌并向下走', NULL),

  ('00000000-0000-0001-0000-000000000005', 2,
   'SEOUL STN · LINE 4 GATE',     '→',
   'Pass through Line 4 ticket gate with T-money card or single-trip ticket',
   'T-マネーカードまたは一回用チケットで4号線の改札を通る',
   '用T-money卡或单程票过4号线闸机', NULL),

  ('00000000-0000-0001-0000-000000000005', 3,
   'SEOUL STN · LINE 4 PLATFORM', '↑',
   'Board Line 4 — direction Danggogae (당고개) · Blue trains',
   '4号線 당고개（タンゴゲ）方面に乗車 · 青い列車',
   '乘4号线 · 开往당고개方向 · 蓝色列车', NULL),

  ('00000000-0000-0001-0000-000000000005', 4,
   'ON LINE 4 · 2 STOPS',         '→',
   'Ride 2 stops (~5 min) — Hoehyeon → Myeongdong',
   '2駅乗車（約5分）— 会賢 → 明洞',
   '乘坐2站（约5分钟）— 회현 → 명동', NULL),

  ('00000000-0000-0001-0000-000000000005', 5,
   'MYEONGDONG STN · PLATFORM',   '↑',
   'Exit at Myeongdong Station',
   '明洞駅で下車',
   '在明洞站下车', NULL),

  ('00000000-0000-0001-0000-000000000005', 6,
   'MYEONGDONG · EXIT 5',         '✓',
   'Take Exit 5 — Myeongdong main shopping street! You''ve arrived!',
   '5番出口から明洞メインストリートへ！到着！',
   '走5号出口到明洞主购物街！您已到达！', 20);


-- =============================================================
-- ROUTE 6 : Myeongdong → Seoul Station  (Line 4 · 5 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000006', 1,
   'MYEONGDONG · EXIT 5',         '↓',
   'Enter Myeongdong Station via Exit 5',
   '5番出口から明洞駅へ入る',
   '从5号出口进入明洞站', NULL),

  ('00000000-0000-0001-0000-000000000006', 2,
   'MYEONGDONG STN · LINE 4 GATE','→',
   'Pass through Line 4 ticket gate with T-money or single-trip ticket',
   'T-マネーまたは一回用チケットで改札を通る',
   '用T-money或单程票过闸机', NULL),

  ('00000000-0000-0001-0000-000000000006', 3,
   'MYEONGDONG · LINE 4 PLATFORM','↑',
   'Board Line 4 — direction Sadeang (사당) · Blue trains',
   '4号線 사당（サダン）方面に乗車 · 青い列車',
   '乘4号线 · 开往사당方向 · 蓝色列车', NULL),

  ('00000000-0000-0001-0000-000000000006', 4,
   'ON LINE 4 · 2 STOPS',         '→',
   'Ride 2 stops (~5 min) — Hoehyeon → Seoul Station',
   '2駅乗車（約5分）— 회현 → ソウル駅',
   '乘坐2站（约5分钟）— 회현 → 首尔站', NULL),

  ('00000000-0000-0001-0000-000000000006', 5,
   'SEOUL STN · LINE 4 PLATFORM', '↑',
   'Exit at Seoul Station · Follow exit or transfer signs',
   'ソウル駅で下車 · 出口または乗換え案内に従う',
   '在首尔站下车 · 按出口或换乘指示走', NULL),

  ('00000000-0000-0001-0000-000000000006', 6,
   'SEOUL STN · STREET LEVEL',    '✓',
   'Take any exit to street level · You''ve arrived at Seoul Station!',
   'お好きな出口から地上へ · ソウル駅に到着！',
   '从任意出口到达地面 · 您已到达首尔站！', 30);


-- =============================================================
-- ROUTE 7 : Hongik Univ. → Myeongdong  (Line 2 + Line 4 · 40 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000007', 1,
   'HONGDAE · LINE 2 ENTRANCE',   '↓',
   'Find Line 2 (Green line) entrance at Hongik University Station',
   '弘益大学駅で2号線（緑）の入口を探す',
   '在弘大入口站找2号线（绿色）入口', NULL),

  ('00000000-0000-0001-0000-000000000007', 2,
   'HONGDAE · LINE 2 PLATFORM',   '↑',
   'Board Line 2 inner loop — direction City Hall (시청) side · Green trains',
   '2号線内回り · 시청（シチョン）方面に乗車 · 緑の列車',
   '乘2号线内环 · 开往시청方向 · 绿色列车', NULL),

  ('00000000-0000-0001-0000-000000000007', 3,
   'ON LINE 2 · 9 STOPS',         '→',
   'Ride 9 stops (~25 min) to DDP (Dongdaemun History & Culture Park)',
   '9駅乗車（約25分）でDDP（東大門歴史文化公園）へ',
   '乘坐9站（约25分钟）到DDP（东大门历史文化公园）', NULL),

  ('00000000-0000-0001-0000-000000000007', 4,
   'DDP STN · LINE 2 PLATFORM',   '↑',
   'Exit Line 2 at DDP Station',
   'DDP駅で2号線を下車',
   '在DDP站下2号线', NULL),

  ('00000000-0000-0001-0000-000000000007', 5,
   'DDP · TRANSFER CORRIDOR',     '↗',
   'Follow "Line 4 (Blue)" transfer signs through the corridor',
   '通路で「4号線（青）」乗換え案内に従う',
   '在通道内按"4号线（蓝色）"换乘指示走', NULL),

  ('00000000-0000-0001-0000-000000000007', 6,
   'DDP · LINE 4 PLATFORM',       '↑',
   'Board Line 4 — direction Danggogae (당고개) · Blue trains',
   '4号線 당고개（タンゴゲ）方面に乗車 · 青い列車',
   '乘4号线 · 开往당고개方向 · 蓝色列车', NULL),

  ('00000000-0000-0001-0000-000000000007', 7,
   'ON LINE 4 · 2 STOPS',         '→',
   'Ride 2 stops (~5 min) — Chungmuro → Myeongdong',
   '2駅乗車（約5分）— 충무로 → 明洞',
   '乘坐2站（约5分钟）— 충무로 → 明洞', NULL),

  ('00000000-0000-0001-0000-000000000007', 8,
   'MYEONGDONG STN · PLATFORM',   '↑',
   'Exit at Myeongdong Station',
   '明洞駅で下車',
   '在明洞站下车', NULL),

  ('00000000-0000-0001-0000-000000000007', 9,
   'MYEONGDONG · EXIT 5',         '✓',
   'Take Exit 5 — Myeongdong main street! You''ve arrived!',
   '5番出口から明洞メインストリートへ！到着！',
   '走5号出口到明洞主街！您已到达！', 20);


-- =============================================================
-- ROUTE 8 : Myeongdong → Hongik Univ.  (Line 4 + Line 2 · 40 min)
-- =============================================================
INSERT INTO public.route_steps
    (route_id, step_number, location_stamp, direction, instruction_en, instruction_ja, instruction_zh, distance_m)
VALUES
  ('00000000-0000-0001-0000-000000000008', 1,
   'MYEONGDONG · EXIT 5',         '↓',
   'Enter Myeongdong Station via Exit 5',
   '5番出口から明洞駅へ',
   '从5号出口进入明洞站', NULL),

  ('00000000-0000-0001-0000-000000000008', 2,
   'MYEONGDONG · LINE 4 PLATFORM','↑',
   'Board Line 4 — direction Sadeang (사당) · Blue trains',
   '4号線 사당（サダン）方面に乗車 · 青い列車',
   '乘4号线 · 开往사당方向 · 蓝色列车', NULL),

  ('00000000-0000-0001-0000-000000000008', 3,
   'ON LINE 4 · 2 STOPS',         '→',
   'Ride 2 stops (~5 min) to DDP',
   '2駅乗車（約5分）でDDPへ',
   '乘坐2站（约5分钟）到DDP', NULL),

  ('00000000-0000-0001-0000-000000000008', 4,
   'DDP STN · LINE 4 PLATFORM',   '↑',
   'Exit Line 4 at DDP Station',
   'DDP駅で4号線を下車',
   '在DDP站下4号线', NULL),

  ('00000000-0000-0001-0000-000000000008', 5,
   'DDP · TRANSFER CORRIDOR',     '↗',
   'Follow "Line 2 (Green)" transfer signs through the corridor',
   '通路で「2号線（緑）」乗換え案内に従う',
   '在通道内按"2号线（绿色）"换乘指示走', NULL),

  ('00000000-0000-0001-0000-000000000008', 6,
   'DDP · LINE 2 PLATFORM',       '↑',
   'Board Line 2 outer loop — direction Hongdae (홍대입구) · Green trains',
   '2号線外回り · 홍대입구（ホンデイック）方面に乗車 · 緑の列車',
   '乘2号线外环 · 开往홍대입구方向 · 绿色列车', NULL),

  ('00000000-0000-0001-0000-000000000008', 7,
   'ON LINE 2 · 9 STOPS',         '→',
   'Ride 9 stops (~25 min) to Hongik University Station',
   '9駅乗車（約25分）で弘益大学駅へ',
   '乘坐9站（约25分钟）到弘大入口站', NULL),

  ('00000000-0000-0001-0000-000000000008', 8,
   'HONGDAE STN · PLATFORM',      '↑',
   'Exit at Hongik University Station',
   '弘益大学駅で下車',
   '在弘大入口站下车', NULL),

  ('00000000-0000-0001-0000-000000000008', 9,
   'HONGDAE · EXIT 3',            '✓',
   'Take Exit 3 — Hongdae main street! You''ve arrived!',
   '3番出口から弘大メインストリートへ！到着！',
   '走3号出口到弘大主街！您已到达！', 20);


-- =============================================================
-- 확인용 조회 쿼리
-- =============================================================
-- SELECT s.name_en, r.transport_method, r.duration_min, r.price_krw, r.total_steps
--   FROM routes r
--   JOIN stations s ON s.id = r.from_station_id
-- ORDER BY r.id;

-- SELECT rs.step_number, rs.location_stamp, rs.direction, rs.instruction_en
--   FROM route_steps rs
--  WHERE rs.route_id = '00000000-0000-0001-0000-000000000001'
-- ORDER BY rs.step_number;
