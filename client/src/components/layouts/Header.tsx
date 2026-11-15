import { Link, NavLink } from 'react-router'
import { useAuth } from '../../lib/auth-context'
import Logo from './Logo'
import VuMeter from './VuMeter'

// 앰프의 채널 선택 스위치처럼: LED + 번호 + 이름
const channels = [
  { to: '/', label: '홈', end: true, led: 'bg-neon-lime' },
  { to: '/recordings', label: '녹음', led: 'bg-neon-red' },
  { to: '/feed', label: '피드', led: 'bg-neon-yellow' },
  { to: '/mypage', label: '마이페이지', led: 'bg-neon-blue' },
]

export default function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 bg-stage/90 backdrop-blur">
      <div className="mx-auto flex max-w-[120rem] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4 md:px-10">
        <Logo />

        {/* 채널 선택기 */}
        <nav className="order-last w-full md:order-none md:w-auto">
          <ul className="flex rounded-full border border-line bg-panel p-1">
            {channels.map(({ to, label, end, led }, i) => (
              <li key={to} className="flex-1 md:flex-none">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm whitespace-nowrap md:gap-2.5 md:px-4 ${
                      isActive ? 'bg-stage text-ink' : 'text-dim hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`size-2 rounded-full ${isActive ? led : 'bg-line'}`} />
                      <span className="hidden font-dot text-sm font-black text-dim sm:inline">0{i + 1}</span>
                      <span className="font-semibold">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 계정 */}
        <div className="ml-auto flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <span className="flex items-center gap-2 px-2 text-sm font-semibold">
                <span className="size-2 rounded-full bg-neon-lime" />
                {user.nickname}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-dim hover:text-ink">
                로그인
              </Link>
              <Link
                to="/register"
                className="rounded-full border-2 border-neon-pink px-5 py-2 text-sm font-bold text-neon-pink hover:bg-neon-pink hover:text-stage"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* VU 미터 (헤더 밑줄 역할) */}
      <VuMeter />
    </header>
  )
}
