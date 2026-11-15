import { Outlet } from 'react-router'
import Logo from './Logo'
import StageBackdrop from './StageBackdrop'
import VuMeter from './VuMeter'

// 로그인·회원가입 전용 레이아웃: 헤더·푸터 없이 브랜드 패널 + 폼
export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col md:grid md:grid-cols-2">
      {/* 브랜드 패널: 데스크톱은 왼쪽 전체, 모바일은 위쪽 띠 */}
      <aside className="relative flex flex-col justify-between gap-8 overflow-hidden border-b border-line bg-panel px-6 pt-8 pb-6 md:border-r md:border-b-0 md:p-12">
        <StageBackdrop />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative flex flex-col gap-6 md:gap-10">
          <h1 className="text-2xl leading-[1.15] font-black tracking-tight md:text-6xl md:leading-[1.1]">
            오늘의 연주,
            <br />
            <span className="text-neon-pink">기록할 준비</span> 됐나요?
          </h1>
          <VuMeter className="h-2 md:h-4" />
        </div>
      </aside>

      {/* 폼 영역 */}
      <main className="flex flex-1 flex-col px-6 py-10 md:items-center md:justify-center md:px-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
