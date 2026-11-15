import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// 개발 중에는 /api, /uploads 요청을 백엔드(3000번 포트)로 넘긴다
const backend = 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/api': backend, '/uploads': backend },
  },
  preview: {
    proxy: { '/api': backend, '/uploads': backend },
  },
})
