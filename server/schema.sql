-- Amply 데이터베이스 스키마
-- 실행: mysql -u root -p amply_20606 < schema.sql

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
  file_path  VARCHAR(255) NOT NULL,         -- uploads/ 아래 저장된 파일 이름
  duration   FLOAT,                         -- 초
  bpm        INT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 회원이 탈퇴하면 그 회원의 녹음도 함께 삭제
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
