import express from 'express';
import fs from 'node:fs';
import './db.js'; // .env를 읽고 DB 연결을 확인한다
import usersRouter from './routes/users.js';
import recordingsRouter from './routes/recordings.js';

const app = express();
const PORT = process.env.PORT || 3000;

fs.mkdirSync('uploads', { recursive: true }); // 녹음 파일 저장 폴더

app.use(express.json());
app.use('/uploads', express.static('uploads')); // 저장된 녹음 파일을 그대로 내려준다

app.use('/api/users', usersRouter);
app.use('/api/recordings', recordingsRouter);

// 라우트에서 처리하지 못한 에러는 여기로 모인다
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요.' });
});

app.listen(PORT, () => {
  console.log(`🎸 Amply 서버 실행 중: http://localhost:${PORT}`);
});
