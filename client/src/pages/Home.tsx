import { Link } from 'react-router'

// 페스티벌 라인업처럼: 위 줄일수록 크게 (헤드라이너 → 서브)
const lineup = [
  { size: 'text-5xl md:text-8xl', acts: [{ en: 'ANALYZE', ko: '음향 분석' }] },
  {
    size: 'text-3xl md:text-5xl',
    acts: [
      { en: 'TUNER', ko: '튜너' },
      { en: 'METRONOME', ko: '메트로놈' },
    ],
  },
  {
    size: 'text-2xl md:text-4xl',
    acts: [
      { en: 'TRACK', ko: '연습 기록' },
      { en: 'RECORD', ko: '녹음' },
    ],
  },
]

export default function Home() {
  return (
    <section className="flex border-y-2 border-ink">
      {/* 세로 타이틀 (데스크톱) */}
      <div className="hidden items-center border-r-2 border-ink px-4 md:flex">
        <span className="text-outline rotate-180 text-[9rem] leading-none font-black [writing-mode:vertical-rl]">
          AMPLY
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-14 px-6 py-12 md:px-14 md:py-16">
          {/* 메인 카피 */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl leading-[1.05] font-black tracking-tight md:text-8xl">
              연주를
              <br />
              <span className="text-neon-lime">직접 확인해보세요.</span>
            </h1>
            <p className="max-w-xl text-lg text-dim md:text-xl">
              기타 연주를 분석하고, 연습을 돕고, 성장을 기록하는 무대.
            </p>
          </div>

          {/* 라인업 */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="font-dot text-sm font-black">LINE UP</span>
              <span className="h-0.5 flex-1 bg-ink" />
            </div>
            {lineup.map((row, i) => (
              <div key={i} className="flex flex-wrap items-end gap-x-8 gap-y-4 md:gap-x-12">
                {row.acts.map((act) => (
                  <span key={act.en} className="flex flex-col">
                    <span className={`${row.size} leading-none font-black tracking-tight`}>{act.en}</span>
                    <span className="mt-1 text-sm font-semibold text-dim">{act.ko}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* 티켓 */}
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/recordings" className="flex text-stage">
              <span className="flex items-center gap-3 rounded-l-2xl bg-white px-8 py-5 text-xl font-black">
                녹음 시작 ▸
              </span>
              <span className="relative flex items-center rounded-r-2xl border-l-2 border-dashed border-panel bg-neon-red px-6" aria-hidden="true">
                {/* 절취선 양 끝 홈 */}
                <span className="absolute -top-2.5 -left-[11px] size-5 rounded-full bg-panel" />
                <span className="absolute -bottom-2.5 -left-[11px] size-5 rounded-full bg-panel" />
                <span className="size-3 rounded-full bg-stage" />
              </span>
            </Link>
            <Link to="/register" className="font-semibold text-dim underline-offset-4 hover:text-ink hover:underline">
              회원가입하고 입장하기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
