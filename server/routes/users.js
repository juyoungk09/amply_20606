import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import pool from '../db.js';
import auth from '../middlewares/auth.js';

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// [Create] 회원가입
router.post('/register', async (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password || !nickname) {
    return res.status(400).json({ message: '아이디, 비밀번호, 닉네임을 모두 입력해 주세요.' });
  }

  const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if (exists.length > 0) {
    return res.status(409).json({ message: '이미 사용 중인 아이디예요.' });
  }

  const hashed = await bcrypt.hash(password, 10); // 비밀번호는 bcrypt로 암호화해서 저장
  await pool.query('INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)', [
    username,
    hashed,
    nickname,
  ]);
  res.status(201).json({ message: '가입이 완료됐어요.' });
});

// [Read] 로그인: 비밀번호를 확인하고 JWT 발급
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password ?? '', user.password))) {
    return res.status(401).json({ message: '아이디 또는 비밀번호가 맞지 않아요.' });
  }

  res.json({
    token: makeToken(user),
    user: { id: user.id, username: user.username, nickname: user.nickname, created_at: user.created_at },
  });
});

// [Read] 내 프로필 조회
router.get('/me', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT id, username, nickname, created_at FROM users WHERE id = ?', [
    req.user.id,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ message: '회원 정보를 찾을 수 없어요.' });
  }
  res.json(rows[0]);
});

// [Update] 프로필 수정: 닉네임, 비밀번호(입력한 경우에만) 변경
router.put('/me', auth, async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname) {
    return res.status(400).json({ message: '닉네임을 입력해 주세요.' });
  }

  await pool.query('UPDATE users SET nickname = ? WHERE id = ?', [nickname, req.user.id]);
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
  }

  const [rows] = await pool.query('SELECT id, username, nickname, created_at FROM users WHERE id = ?', [
    req.user.id,
  ]);
  res.json(rows[0]);
});

// [Delete] 회원 탈퇴: 녹음 파일도 함께 지운다 (DB 행은 ON DELETE CASCADE로 자동 삭제)
router.delete('/me', auth, async (req, res) => {
  const [files] = await pool.query('SELECT file_path FROM recordings WHERE user_id = ?', [req.user.id]);
  await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);

  for (const { file_path } of files) {
    await fs.rm(`uploads/${file_path}`, { force: true });
  }
  res.json({ message: '탈퇴가 완료됐어요.' });
});

export default router;
