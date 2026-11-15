import { Outlet, useMatch } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import StageBackdrop from './StageBackdrop'

export default function MainLayout() {
  // 홈에서만 로그인 화면 왼쪽 패널과 같은 무대 배경을 깐다
  const isHome = useMatch('/')

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className={`relative flex-1 ${isHome ? 'bg-panel' : ''}`}>
        {isHome && (
          // 그릴·조명은 화면 위쪽에만 (아래로 갈수록 사라짐)
          <div className="absolute inset-x-0 top-0 h-[48rem] overflow-hidden">
            <StageBackdrop />
          </div>
        )}
        {/* 홈 포스터는 데스크톱에서 더 넓게 */}
        <main className={`relative mx-auto w-full px-6 py-12 ${isHome ? 'max-w-[120rem] md:px-10' : 'max-w-7xl'}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
