import jwt from 'jsonwebtoken';

// 로그인이 필요한 API 앞에 붙이는 미들웨어
// 요청 헤더의 "Authorization: Bearer <토큰>"을 검증하고, 통과하면 req.user에 { id, username }을 넣는다
export default function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: '로그인이 필요해요.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: '로그인이 만료됐어요. 다시 로그인해 주세요.' });
  }
}
