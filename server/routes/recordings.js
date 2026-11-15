import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import pool from '../db.js';
import auth from '../middlewares/auth.js';

const router = Router();

// 비어 있지 않은 문자열이고 max 글자 이하인지 (DB 컬럼 길이를 넘지 않게)
const isText = (value, max) => typeof value === 'string' && value.trim() !== '' && value.length <= max;

// 오디오 확장자만 허용 (html 같은 파일이 그대로 열리지 않도록)
const AUDIO_EXTS = ['.webm', '.ogg', '.m4a', '.mp3', '.wav'];

// 업로드한 오디오 파일은 server/uploads 폴더에 "시간-랜덤숫자.확장자" 이름으로 저장
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = AUDIO_EXTS.includes(ext) ? ext : '.webm';
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
  }),
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('audio/')), // 오디오가 아니면 저장하지 않음
  limits: { fileSize: 50 * 1024 * 1024 }, // 최대 50MB
});

// 본인 글인지 확인하고, 아니면 null
async function findOwnRecording(id, userId) {
  const [rows] = await pool.query('SELECT * FROM recordings WHERE id = ?', [id]);
  const recording = rows[0];
  if (!recording || recording.user_id !== userId) return null;
  return recording;
}

// [Read + JOIN] 전체 녹음 목록: recordings와 users를 JOIN해서 작성자 닉네임까지 함께 조회
// 로그인하지 않아도 볼 수 있다
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT r.id, r.title, r.memo, r.file_path, r.duration, r.bpm, r.created_at,
           r.user_id, u.nickname
    FROM recordings r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);
  res.json(rows);
});

// [Create] 녹음 업로드: 로그인한 사용자만
router.post('/', auth, upload.single('audio'), async (req, res) => {
  const { title, memo, duration, bpm } = req.body ?? {};
  if (!req.file || !isText(title, 100)) {
    if (req.file) await fs.rm(req.file.path, { force: true }); // 이미 저장된 파일은 지운다
    return res.status(400).json({ message: '오디오 파일과 제목(100자 이내)이 필요해요.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO recordings (user_id, title, memo, file_path, duration, bpm) VALUES (?, ?, ?, ?, ?, ?)',
      // 숫자가 아니면 NaN → null로 저장
      [req.user.id, title, memo || null, req.file.filename, Number(duration) || null, Math.round(Number(bpm)) || null],
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await fs.rm(req.file.path, { force: true }); // DB 저장에 실패하면 파일도 지운다
    throw err;
  }
});

// [Update] 제목·메모 수정: 본인 녹음만
router.put('/:id', auth, async (req, res) => {
  const { title, memo } = req.body ?? {};
  if (!isText(title, 100)) {
    return res.status(400).json({ message: '제목은 100자 이내로 입력해 주세요.' });
  }
  if (!(await findOwnRecording(req.params.id, req.user.id))) {
    return res.status(403).json({ message: '본인이 올린 녹음만 수정할 수 있어요.' });
  }

  await pool.query('UPDATE recordings SET title = ?, memo = ? WHERE id = ?', [title, memo || null, req.params.id]);
  res.json({ message: '수정했어요.' });
});

// [Delete] 녹음 삭제: 본인 녹음만, 파일도 함께 삭제
router.delete('/:id', auth, async (req, res) => {
  const recording = await findOwnRecording(req.params.id, req.user.id);
  if (!recording) {
    return res.status(403).json({ message: '본인이 올린 녹음만 삭제할 수 있어요.' });
  }

  await pool.query('DELETE FROM recordings WHERE id = ?', [req.params.id]);
  await fs.rm(`uploads/${recording.file_path}`, { force: true });
  res.json({ message: '삭제했어요.' });
});

export default router;
