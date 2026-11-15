import { useEffect, useState } from 'react'
import { formatDb, toDb } from '../../lib/audio'

const SEGMENTS = 40
const FLOOR_DB = -60

type Level = { level: number; peak: number; clip: boolean }
const SILENT: Level = { level: -Infinity, peak: -Infinity, clip: false }

// 마이크 스트림의 실시간 입력 레벨(dBFS)을 읽는다
function useInputLevel(stream: MediaStream | null): Level {
  const [state, setState] = useState<Level>(SILENT)

  useEffect(() => {
    if (!stream) return

    const ctx = new AudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    source.connect(analyser)
    const buf = new Float32Array(analyser.fftSize)

    let raf = 0
    let level = -Infinity
    let peak = -Infinity
    let peakAt = 0
    let clipAt = -Infinity

    const tick = (now: number) => {
      analyser.getFloatTimeDomainData(buf)
      let max = 0
      for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i]))
      const db = toDb(max)

      level = Math.max(db, level - 1.2) // 바늘이 천천히 떨어지도록
      if (db >= peak || now - peakAt > 1500) {
        peak = db // 피크 홀드 1.5초
        peakAt = now
      }
      if (db >= -0.5) clipAt = now

      setState({ level, peak, clip: now - clipAt < 1000 })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      source.disconnect()
      ctx.close()
    }
  }, [stream])

  return stream ? state : SILENT
}

function dbToSegments(db: number) {
  if (!Number.isFinite(db)) return 0
  return Math.round(((Math.max(db, FLOOR_DB) - FLOOR_DB) / -FLOOR_DB) * SEGMENTS)
}

// -60 ~ 0 dB를 40칸으로: -12 dB까지 연두, -3 dB까지 노랑, 그 위는 빨강
function segmentColor(i: number) {
  const db = FLOOR_DB + ((i + 1) / SEGMENTS) * -FLOOR_DB
  if (db <= -12) return 'bg-neon-lime'
  if (db <= -3) return 'bg-neon-yellow'
  return 'bg-neon-red'
}

export default function LevelMeter({ stream }: { stream: MediaStream | null }) {
  const { level, peak, clip } = useInputLevel(stream)
  const lit = dbToSegments(level)
  const peakIndex = dbToSegments(peak) - 1

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-semibold text-dim">
        <span>입력 레벨</span>
        <span className="flex items-center gap-4">
          <span className="font-dot text-sm font-black text-ink">{formatDb(level)}</span>
          <span className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${clip ? 'bg-neon-red' : 'bg-line'}`} />
            <span className={clip ? 'text-neon-red' : ''}>CLIP</span>
          </span>
        </span>
      </div>
      <div className="flex h-3 gap-0.5" role="meter" aria-label="입력 레벨" aria-valuemin={FLOOR_DB} aria-valuemax={0} aria-valuenow={Number.isFinite(level) ? Math.round(level) : FLOOR_DB}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={`flex-1 ${i < lit || i === peakIndex ? segmentColor(i) : 'bg-line'}`}
          />
        ))}
      </div>
      {/* 눈금: 실제 dB 위치에 맞춰 배치 */}
      <div className="relative h-3 font-dot text-[10px] font-black text-dim">
        {[-60, -24, -12, -3, 0].map((db) => (
          <span
            key={db}
            className="absolute top-0 -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${((db - FLOOR_DB) / -FLOOR_DB) * 100}%` }}
          >
            {db}
          </span>
        ))}
      </div>
    </div>
  )
}
