import { useEffect, useState } from 'react'

const SEGMENTS = 48

// 칸 위치에 따른 색: 앞쪽 연두 → 노랑 → 끝쪽 빨강
function segmentColor(i: number) {
  if (i < 30) return 'bg-neon-lime'
  if (i < 40) return 'bg-neon-yellow'
  return 'bg-neon-red'
}

type VuMeterProps = {
  /** 미터 높이 등 추가 클래스 (기본: h-1) */
  className?: string
}

// 음악이 흐르는 것처럼 보이도록 레벨을 출렁이게 만드는 장식용 미터
export default function VuMeter({ className = 'h-1' }: VuMeterProps) {
  const [level, setLevel] = useState(28)

  useEffect(() => {
    // 움직임 줄이기 설정을 켠 사용자에게는 멈춘 상태로 보여 준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      setLevel((prev) => {
        // 가끔 크게 튀는 피크, 평소엔 중간 레벨에서 출렁임
        const target = Math.random() < 0.08 ? SEGMENTS - 2 : 18 + Math.random() * 18
        return Math.round(prev * 0.5 + target * 0.5)
      })
    }, 90)

    return () => clearInterval(id)
  }, [])

  return (
    <div className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span key={i} className={`flex-1 ${i < level ? segmentColor(i) : 'bg-line'}`} />
      ))}
    </div>
  )
}
