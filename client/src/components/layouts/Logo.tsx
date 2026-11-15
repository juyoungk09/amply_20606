import { Link } from 'react-router'

// 앰프 명판 스타일 로고 (헤더·푸터 공용)
export default function Logo() {
  return (
    <Link to="/" className="flex flex-col leading-none">
      <span className="text-2xl font-bold text-ink">Amply</span>
      <span className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-dim">GUITAR LAB</span>
    </Link>
  )
}
