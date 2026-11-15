import { Link } from 'react-router'
import Logo from './Logo'

// 앰프 뒷면의 입출력 단자처럼 꾸민 바로가기
const jacks = [
  { to: '/recordings', label: 'REC', ring: 'border-neon-red' },
  { to: '/mypage', label: 'MY', ring: 'border-neon-blue' },
  { to: '/register', label: 'JOIN', ring: 'border-neon-pink' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto flex max-w-[120rem] flex-wrap items-center justify-between gap-8 px-6 py-10 md:px-10">
        <Logo />

        {/* 단자 */}
        <nav className="flex gap-6">
          {jacks.map(({ to, label, ring }) => (
            <Link key={to} to={to} className="group flex flex-col items-center gap-2">
              <span className={`flex size-10 items-center justify-center rounded-full border-4 ${ring}`}>
                <span className="size-3 rounded-full bg-stage group-hover:bg-ink" />
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-dim group-hover:text-ink">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* 전원 표시 + 저작권 */}
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-dim">
            <span className="size-2 rounded-full bg-neon-lime" />
            POWER
          </span>
          <span className="font-dot text-sm font-black text-dim">© {new Date().getFullYear()} AMPLY</span>
        </div>
      </div>
    </footer>
  )
}
