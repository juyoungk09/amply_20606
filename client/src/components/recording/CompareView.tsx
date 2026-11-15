import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { formatDb, formatTime, themeColor } from '../../lib/audio'
import type { Take } from './types'

type MiniWaveProps = {
  take: Take
  tag: 'A' | 'B'
  color: string
  tagClass: string
}

function MiniWave({ take, tag, color, tagClass }: MiniWaveProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!waveRef.current) return
    const ws = WaveSurfer.create({
      container: waveRef.current,
      height: 72,
      url: take.url,
      waveColor: themeColor('--color-line'),
      progressColor: themeColor(color),
      cursorColor: themeColor('--color-ink'),
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
    })
    ws.on('play', () => setPlaying(true))
    ws.on('pause', () => setPlaying(false))
    ws.on('finish', () => setPlaying(false))
    wsRef.current = ws
    return () => {
      wsRef.current = null
      ws.destroy()
    }
  }, [take.url, color])

  return (
    <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-dot text-lg font-black text-stage ${tagClass}`}>
        {tag}
      </span>
      <button
        type="button"
        onClick={() => wsRef.current?.playPause()}
        className="w-20 shrink-0 rounded-full border border-line py-2 text-sm font-semibold text-dim hover:text-ink"
      >
        {playing ? '정지' : '재생'}
      </button>
      <div className="w-full min-w-0 rounded-xl border border-line bg-stage px-2 md:flex-1">
        <div ref={waveRef} />
      </div>
    </div>
  )
}

// 두 값의 차이를 +/− 기호와 함께 표시
function delta(a: number | null | undefined, b: number | null | undefined, unit: string, digits = 1) {
  if (a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b)) return '—'
  const d = b - a
  if (Math.abs(d) < 10 ** -digits) return '±0'
  return `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(digits)}${unit}`
}

export default function CompareView({ a, b }: { a: Take; b: Take }) {
  const x = a.analysis
  const y = b.analysis
  const rows = [
    {
      label: '길이',
      a: x ? formatTime(x.duration) : '…',
      b: y ? formatTime(y.duration) : '…',
      d: delta(x?.duration, y?.duration, '초'),
    },
    {
      label: '추정 템포',
      a: x?.bpm ? `${x.bpm} BPM` : '—',
      b: y?.bpm ? `${y.bpm} BPM` : '—',
      d: delta(x?.bpm, y?.bpm, ' BPM', 0),
    },
    {
      label: '피크',
      a: x ? formatDb(x.peakDb) : '…',
      b: y ? formatDb(y.peakDb) : '…',
      d: delta(x?.peakDb, y?.peakDb, ' dB'),
    },
    {
      label: '평균 음량',
      a: x ? formatDb(x.rmsDb) : '…',
      b: y ? formatDb(y.rmsDb) : '…',
      d: delta(x?.rmsDb, y?.rmsDb, ' dB'),
    },
  ]

  return (
    <section className="panel flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 md:px-8">
        <h2 className="text-xl font-black">테이크 비교</h2>
        <span className="text-sm text-dim">
          {a.name} → {b.name}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-8">
        <MiniWave take={a} tag="A" color="--color-neon-pink" tagClass="bg-neon-pink" />
        <MiniWave take={b} tag="B" color="--color-neon-blue" tagClass="bg-neon-blue" />

        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left">
            <thead>
              <tr className="border-b border-line text-xs font-semibold text-dim">
                <th className="py-3 pr-4 font-semibold">항목</th>
                <th className="py-3 pr-4 font-semibold text-neon-pink">A · {a.name}</th>
                <th className="py-3 pr-4 font-semibold text-neon-blue">B · {b.name}</th>
                <th className="py-3 font-semibold">차이 (B − A)</th>
              </tr>
            </thead>
            <tbody className="font-dot text-base font-black">
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4 font-sans text-sm font-semibold text-dim">{r.label}</td>
                  <td className="py-3 pr-4">{r.a}</td>
                  <td className="py-3 pr-4">{r.b}</td>
                  <td className="py-3">{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
