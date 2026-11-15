# Amply
### Guitar Audio Analysis & Practice Platform

## 1. 프로젝트 소개

**Amply**는 기타 연주자를 위한 음향 분석 및 연습 관리 웹서비스이다.

기타 연주자가 자신의 연주를 분석하고, 연습곡과 연습 기록을 관리하며, 다양한 연습 도구를 활용하여 효율적으로 연습할 수 있도록 돕는 것을 목표로 한다.

### 주요 서비스 방향

- **Analyze:** 기타 연주 음향 분석
- **Practice:** 기타 연습 보조 도구 제공
- **Track:** 연습 과정 및 분석 결과 기록

---

## 2. 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Audio Processing | Web Audio API |
| Visualization | wavesurfer.js (Canvas 기반 파형) |
| Backend | Node.js + Express |
| File Upload | multer |
| Database | MySQL |
| Authentication | JWT |
| Password Encryption | bcrypt |

---

## 3. 기능 명세

### 3.1. 회원 관리

모든 프로젝트에서 공통으로 구현하는 회원 관리 기능이다.

| 기능 | 상세 설명 |
|---|---|
| 회원가입 | 아이디, 비밀번호, 닉네임을 입력하여 회원가입 |
| 로그인 | 회원 정보를 검증하고 JWT 발급 |
| 로그아웃 | 로그인 상태 해제 |
| 마이페이지 | 로그인한 사용자의 프로필 정보 조회 |
| 프로필 수정 | 닉네임 및 비밀번호 변경 |
| 회원 탈퇴 | 사용자 계정 삭제 |

**필수 구현 사항**
- 비밀번호 bcrypt 암호화
- JWT 기반 사용자 인증
- 인증이 필요한 API에 대한 접근 제어

### 3.2. 음향 분석

기타 또는 마이크로 입력받은 소리를 분석하고 결과를 시각화하는 기능이다.

| 기능 | 상세 설명 |
|---|---|
| 오디오 입력 | 마이크 또는 오디오 인터페이스를 통한 소리 입력 |
| 실시간 파형 분석 | 입력된 소리의 진폭을 파형으로 시각화 |
| 주파수 분석 | FFT를 이용하여 주파수별 에너지 분석 |
| 음량 분석 | 입력된 소리의 음량 측정 |
| 음정 분석 | 연주 중 감지된 음과 주파수 확인 |
| 분석 결과 저장 | 분석 결과를 데이터베이스에 저장 |
| 분석 기록 조회 | 과거에 저장한 분석 결과 조회 |
| 분석 기록 수정 | 본인이 작성한 분석 메모 수정 |
| 분석 기록 삭제 | 본인이 작성한 분석 기록 삭제 |

### 3.3. 연습곡 관리

사용자가 연습하고 싶은 곡을 등록하고 관리하는 기능이다.

| 기능 | 상세 설명 |
|---|---|
| 곡 등록 | 연습할 곡의 제목과 아티스트 등록 |
| 곡 목록 조회 | 등록된 연습곡 목록 확인 |
| 곡 상세 조회 | 곡의 상세 정보 확인 |
| 곡 정보 수정 | 곡 제목, 아티스트, BPM 등 수정 |
| 곡 삭제 | 등록한 연습곡 삭제 |
| 목표 BPM 설정 | 곡을 연습할 목표 속도 설정 |
| 튜닝 설정 | 곡에 맞는 기타 튜닝 정보 기록 |
| 연습 상태 관리 | 연습 예정, 연습 중, 완료 상태 관리 |

**곡 정보 항목**
- 곡 제목
- 아티스트
- 목표 BPM
- 기타 튜닝 방식 (Standard, Drop D 등)
- 난이도
- 개인 메모

### 3.4. 기타 연습 도구

기타 연주에 필요한 기본적인 연습 도구를 제공한다.

| 기능 | 상세 설명 |
|---|---|
| 메트로놈 | 설정한 BPM에 맞춰 박자 재생 |
| 박자 설정 | 4/4, 3/4 등 박자 설정 |
| 기타 튜너 | 마이크를 이용한 실시간 음정 감지 |
| 튜닝 방식 선택 | Standard, Drop D 등 대체 튜닝 선택 |
| 연습 속도 조절 | 메트로놈 BPM 조절 |

### 3.5. 연습 기록 및 통계

사용자의 기타 연습 과정을 기록하고 통계로 확인하는 기능이다.

| 기능 | 상세 설명 |
|---|---|
| 연습 기록 작성 | 연습한 곡, 시간, 내용 기록 |
| 연습 시간 관리 | 연습에 소요된 시간 기록 |
| 연습 메모 | 어려웠던 부분이나 개선점 작성 |
| 날짜별 기록 조회 | 날짜별 연습 내역 확인 |
| 곡별 연습 기록 | 특정 곡의 연습 이력 조회 |
| 주간 통계 | 주간 연습 시간 및 횟수 시각화 |
| 목표 설정 | 일일 또는 주간 연습 목표 설정 |

### 3.6. 녹음 및 비교

기타 연주를 녹음하고 이전 연주와 비교하는 확장 기능이다.

| 기능 | 상세 설명 |
|---|---|
| 연주 녹음 | 기타 연주를 오디오 파일로 저장 |
| 녹음 파일 조회 | 과거 연주 녹음 재생 |
| 구간 반복 | 지정한 구간 반복 재생 |
| 재생 속도 조절 | 느린 속도로 연주 확인 |
| 녹음 비교 | 이전 연주와 현재 연주 비교 |
| BPM 자동 감지 | 녹음된 연주의 템포 추정 |

---

## 4. 데이터베이스 설계

### 4.1. users

회원 정보를 저장하는 테이블이다.

| 컬럼 | 데이터 타입 | 설명 |
|---|---|---|
| id | INT PK | 회원 고유 ID |
| username | VARCHAR | 아이디 |
| password | VARCHAR | bcrypt 암호화 비밀번호 |
| nickname | VARCHAR | 닉네임 |
| created_at | DATETIME | 가입일 |

### 4.2. analyses

음향 분석 결과를 저장하는 테이블이다.

| 컬럼 | 데이터 타입 | 설명 |
|---|---|---|
| id | INT PK | 분석 고유 ID |
| user_id | INT FK | 작성자 ID |
| song_id | INT FK, NULL | 연습곡 ID |
| title | VARCHAR | 분석 제목 |
| instrument | VARCHAR | 악기 |
| analysis_type | VARCHAR | 분석 유형 |
| frequency | FLOAT | 주요 주파수 |
| volume | FLOAT | 음량 |
| memo | TEXT | 분석 메모 |
| created_at | DATETIME | 작성일 |

### 4.3. songs

사용자의 연습곡 정보를 저장하는 테이블이다.

| 컬럼 | 데이터 타입 | 설명 |
|---|---|---|
| id | INT PK | 곡 고유 ID |
| user_id | INT FK | 등록한 사용자 ID |
| title | VARCHAR | 곡 제목 |
| artist | VARCHAR | 아티스트 |
| target_bpm | INT | 목표 BPM |
| tuning | VARCHAR | 튜닝 방식 |
| difficulty | VARCHAR | 난이도 |
| status | VARCHAR | 연습 상태 |
| memo | TEXT | 개인 메모 |
| created_at | DATETIME | 등록일 |

### 4.4. practice_logs

사용자의 연습 기록을 저장하는 테이블이다.

| 컬럼 | 데이터 타입 | 설명 |
|---|---|---|
| id | INT PK | 기록 고유 ID |
| user_id | INT FK | 사용자 ID |
| song_id | INT FK | 연습곡 ID |
| duration | INT | 연습 시간(분) |
| memo | TEXT | 연습 내용 |
| practiced_at | DATETIME | 연습 날짜 |

### 4.5. recordings

연주 녹음 파일 정보를 저장하는 테이블이다.

| 컬럼 | 데이터 타입 | 설명 |
|---|---|---|
| id | INT PK | 녹음 고유 ID |
| user_id | INT FK | 사용자 ID |
| song_id | INT FK, NULL | 연습곡 ID |
| file_path | VARCHAR | 녹음 파일 경로 |
| created_at | DATETIME | 녹음 날짜 |

---

## 5. 데이터베이스 관계

- users : analyses = 1 : N
- users : songs = 1 : N
- users : practice_logs = 1 : N
- users : recordings = 1 : N
- songs : analyses = 1 : N
- songs : practice_logs = 1 : N
- songs : recordings = 1 : N

모든 사용자별 데이터에는 작성자 ID를 연결하여 본인이 작성한 데이터만 수정하거나 삭제할 수 있도록 한다.

---

## 6. 페이지 구성
React Router를 사용하여 페이지를 구성하며, 로그인 여부에 따라 접근 가능한 페이지를 구분한다.

| 경로 | 페이지 | 주요 기능 | 접근 권한 |
|---|---|---|---|
| `/` | Home | 서비스 소개 및 시작하기 | 전체 |
| `/login` | Login | 회원 로그인 | 비로그인 |
| `/register` | Register | 회원가입 | 비로그인 |
| `/dashboard` | Dashboard | 연습 현황 및 최근 활동 | 로그인 |
| `/analyze` | Analyze | 기타 오디오 분석 | 로그인 |
| `/analyses` | AnalysisList | 분석 결과 목록 | 로그인 |
| `/analyses/:id` | AnalysisDetail | 분석 결과 상세 및 수정·삭제 | 로그인 |
| `/songs` | SongList | 연습곡 목록 | 로그인 |
| `/songs/new` | SongCreate | 연습곡 등록 | 로그인 |
| `/songs/:id` | SongDetail | 연습곡 상세 및 수정·삭제 | 로그인 |
| `/practice` | Practice | 메트로놈 및 튜너 | 로그인 |
| `/practice/logs` | PracticeLogs | 연습 기록 및 통계 | 로그인 |
| `/mypage` | MyPage | 프로필 수정 및 회원 탈퇴 | 로그인 |

---

## 7. 실행 방법

### 7.1. 준비물

- **Node.js** 20 이상 (개발 환경: v24)
- **MySQL 8.0** + **MySQL Workbench**
- 마이크 (녹음 기능 사용 시)

### 7.2. 데이터베이스 만들기 (MySQL Workbench)

1. MySQL Workbench를 열고 `Local instance MySQL80`에 접속한다.
2. 상단 메뉴 **File → New Query Tab**으로 새 SQL 탭을 연다.
3. 아래 SQL을 전부 붙여 넣고 ⚡(**Execute**) 버튼을 눌러 실행한다.
4. 왼쪽 **SCHEMAS** 패널에서 새로고침(🔄)하면 `amply_20606` 아래에 `users`, `recordings` 테이블이 보인다.

```sql
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS amply_20606 DEFAULT CHARACTER SET utf8mb4;
USE amply_20606;

-- 회원
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(30)  NOT NULL UNIQUE,  -- 로그인 아이디
  password   VARCHAR(100) NOT NULL,         -- bcrypt 해시
  nickname   VARCHAR(30)  NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 녹음 (핵심 데이터)
CREATE TABLE IF NOT EXISTS recordings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,         -- 작성자
  title      VARCHAR(100) NOT NULL,
  memo       TEXT,
  file_path  VARCHAR(255) NOT NULL,         -- server/uploads 아래 저장된 파일 이름
  duration   FLOAT,                         -- 길이(초)
  bpm        INT,                           -- 추정 템포
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 회원이 탈퇴하면 그 회원의 녹음도 함께 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

> 데이터베이스 이름을 바꾸고 싶으면 위 SQL의 `amply_20606` 두 곳과 `server/.env`의 `DB_NAME`을 같이 바꾼다.

### 7.3. 서버 환경 변수 설정

`server` 폴더에서 `.env.example`을 복사해 `.env`를 만든다.

```powershell
cd server
Copy-Item .env.example .env
```

`.env`를 열어 값을 채운다. `DB_PASSWORD`는 Workbench에서 `Local instance`에 접속할 때 쓰는 root 비밀번호다.

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=여기에_MySQL_root_비밀번호
DB_NAME=amply_20606

# JWT 서명용 비밀 문자열 (아무 긴 문자열이나 입력)
JWT_SECRET=amply-secret-key-change-me
```

### 7.4. 서버 실행 (터미널 1)

```powershell
cd server
npm install
npm run dev
```

아래 두 줄이 보이면 성공이다.

```
✅ MySQL 데이터베이스 연결 성공!
🎸 Amply 서버 실행 중: http://localhost:3000
```

### 7.5. 클라이언트 실행 (터미널 2)

```powershell
cd client
npm install
npm run dev
```

브라우저에서 **http://localhost:5173** 에 접속한다.
클라이언트의 `/api`, `/uploads` 요청은 Vite 설정(`client/vite.config.ts`)에 의해 3000번 서버로 자동 전달되므로 서버가 먼저 켜져 있어야 한다.

### 7.6. 기능 확인 순서

1. **회원가입** → 가입하면 자동으로 로그인되고 헤더에 닉네임이 표시된다.
2. **녹음** 메뉴 → `녹음` 버튼으로 녹음 → `정지` → 오른쪽 플레이어 아래에서 제목·메모 입력 후 `저장`
3. **피드** 메뉴 → 모든 사용자의 녹음 목록 (작성자 닉네임 = JOIN 결과), 본인 녹음만 `수정`·`삭제` 버튼 표시
4. **마이페이지** → 닉네임·비밀번호 수정, 회원 탈퇴

### 7.7. Workbench 확인용 SQL

발표·검증할 때 Workbench에서 실행해 볼 수 있는 쿼리다.

```sql
USE amply_20606;

-- 회원 목록 (password 컬럼이 $2b$로 시작하면 bcrypt로 암호화된 것)
SELECT id, username, password, nickname, created_at FROM users;

-- 녹음 목록
SELECT * FROM recordings;

-- [JOIN] 피드 메뉴와 같은 쿼리: 녹음 + 작성자 닉네임
SELECT r.id, r.title, r.memo, r.duration, r.bpm, r.created_at, u.nickname
FROM recordings r
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- 회원별 녹음 수
SELECT u.nickname, COUNT(r.id) AS recording_count
FROM users u
LEFT JOIN recordings r ON r.user_id = u.id
GROUP BY u.id, u.nickname;
```

### 7.8. API 목록

| 메서드 | 경로 | 설명 | 로그인 |
|---|---|---|---|
| POST | `/api/users/register` | 회원가입 (bcrypt 암호화) | |
| POST | `/api/users/login` | 로그인, JWT 발급 | |
| GET | `/api/users/me` | 내 프로필 조회 | 필요 |
| PUT | `/api/users/me` | 닉네임·비밀번호 수정 | 필요 |
| DELETE | `/api/users/me` | 회원 탈퇴 (녹음도 함께 삭제) | 필요 |
| GET | `/api/recordings` | 전체 녹음 목록 (users JOIN) | |
| POST | `/api/recordings` | 녹음 업로드 | 필요 |
| PUT | `/api/recordings/:id` | 제목·메모 수정 | 본인만 |
| DELETE | `/api/recordings/:id` | 녹음 삭제 | 본인만 |

녹음 파일은 `server/uploads` 폴더에 저장된다.