import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, // 연결이 다 차있을 때 대기할지 여부
  connectionLimit: 10,      // 최대 동시 연결 수
  queueLimit: 0             // 대기 큐 제한 (0은 무제한)
});

try {
  const connection = await pool.getConnection();
  console.log('✅ MySQL 데이터베이스 연결 성공!');
  connection.release();
} catch (error) {
  console.error('❌ MySQL 데이터베이스 연결 실패:', error.message);
}

export default pool;