import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin, { type Region } from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { fileExtension, formatBytes, formatDb, formatTime, themeColor } from '../../lib/audio'
import SaveTakeForm from './SaveTakeForm'
import type { Take } from './types'

const RATES = [0.5, 0.75, 1, 1.25, 1.5]

type TakePlayerProps = {
  take: Take
  onDelete: () => void
  onSave: (title: string, memo: string) => Promise<void>
}

// 테이크가 바뀌면 부모에서 key로 새로 마운트한다
export default function TakePlayer({ take, onDelete, onSave }: TakePlayerProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<ReturnType<typeof RegionsPlugin.create> | null>(null)
  const loopRegionRef = useRef<Region | null>(null)
  const repeatRef = useRef(true)

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [loop, setLoop] = useState<{ start: number; end: number } | null>(null)
  const [repeat, setRepeat] = useState(true)

  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  useEffect(() => {
    if (!waveRef.current) return

    const regions = RegionsPlugin.create()
    const ws = WaveSurfer.create({
      container: waveRef.current,
      height: 140,
      url: take.url,
      waveColor: themeColor('--color-line'),
      progressColor: themeColor('--color-neon-pink'),
      cursorColor: themeColor('--color-ink'),
      cursorWidth: 2,
      barWidth: 3,
      barGap: 2,
      barRadius: 2,
      plugins: [
        regions,
        TimelinePlugin.create({
          height: 20,
          style: { color: themeColor('--color-dim'), fontSize: '11px' },
        }),
      ],
    })

    // 파형을 드래그하면 반복 구간 생성 (항상 하나만 유지)
    regions.enableDragSelection({
      color: 'color-mix(in oklch, var(--color-neon-yellow) 25%, transparent)',
    })
    const syncLoop = (region: Region) => {
      loopRegionRef.current = region
      setLoop({ start: region.start, end: region.end })
    }
    regions.on('region-created', (region) => {
      regions.getRegions().forEach((r) => r !== region && r.remove())
      syncLoop(region)
    })
    regions.on('region-updated', syncLoop)
    regions.on('region-out', (region) => {
      if (repeatRef.current && ws.isPlaying()) region.play()
    })
    regions.on('region-clicked', (region, e) => {
      e.stopPropagation()
      region.play()
    })

    ws.on('ready', (d) => {
      setDuration(d)
      setReady(true)
    })
    ws.on('timeupdate', setTime)
    ws.on('play', () => setPlaying(true))
    ws.on('pause', () => setPlaying(false))
    ws.on('finish', () => setPlaying(false))

    wsRef.current = ws
    regionsRef.current = regions
    return () => {
      wsRef.current = null
      regionsRef.current = null
      loopRegionRef.current = null
      ws.destroy()
    }
  }, [take.url])

  function togglePlay() {
    const ws = wsRef.current
    const region = loopRegionRef.current
    if (!ws) return
    if (ws.isPlaying()) {
      ws.pause()
      return
    }
    // 반복 구간이 있고 재생 위치가 구간 밖이면 구간 처음부터
    const t = ws.getCurrentTime()
    if (region && repeat && (t < region.start || t >= region.end)) region.play()
    else ws.play()
  }

  function changeRate(r: number) {
    setRate(r)
    wsRef.current?.setPlaybackRate(r, true) // 음정은 유지
  }

  function clearLoop() {
    regionsRef.current?.clearRegions()
    loopRegionRef.current = null
    setLoop(null)
  }

  const a = take.analysis
  const info = [
    { label: '길이', value: formatTime(a?.duration ?? duration) },
    { label: '추정 템포', value: a ? (a.bpm ? `${a.bpm} BPM` : '—') : '분석 중' },
    { label: '피크', value: a ? formatDb(a.peakDb) : '분석 중', warn: a ? a.peakDb >= -0.5 : false },
    { label: '평균 음량', value: a ? formatDb(a.rmsDb) : '분석 중' },
    { label: '샘플레이트', value: a ? `${(a.sampleRate / 1000).toFixed(1)} kHz` : '분석 중' },
    { label: '채널', value: a ? (a.channels === 1 ? '모노' : `${a.channels}ch`) : '분석 중' },
    { label: '파일 크기', value: formatBytes(take.blob.size) },
    { label: '형식', value: fileExtension(take.blob.type).toUpperCase() },
  ]

  return (
    <section className="panel flex min-w-0 flex-col">
      {/* 제목 */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-5 md:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black">{take.name}</h2>
          <span className="text-sm text-dim">{take.createdAt.toLocaleString('ko-KR')} 녹음</span>
        </div>
        <div className="flex gap-2">
          <a
            href={take.url}
            download={`${take.name}.${fileExtension(take.blob.type)}`}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink"
          >
            다운로드
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:border-neon-red hover:text-neon-red"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5 md:p-8">
        {/* 파형 */}
        <div className="rounded-2xl border border-line bg-stage px-3 pt-3">
          <div ref={waveRef} />
        </div>

        {/* 재생 조작 */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              disabled={!ready}
              className="rounded-full bg-neon-pink px-6 py-3 text-base font-black whitespace-nowrap text-stage disabled:opacity-50 md:px-7 md:py-3.5 md:text-lg"
            >
              {playing ? '일시정지' : '재생'}
            </button>
            <span className="font-dot text-lg font-black whitespace-nowrap md:text-xl">
              {formatTime(time)} <span className="text-dim">/ {formatTime(duration)}</span>
            </span>
          </div>

          {/* 재생 속도 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold whitespace-nowrap text-dim">속도</span>
            <div className="flex rounded-full border border-line bg-stage p-1">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeRate(r)}
                  aria-pressed={rate === r}
                  className={`rounded-full px-2.5 py-1.5 font-dot text-sm font-black md:px-3 ${
                    rate === r ? 'bg-ink text-stage' : 'text-dim hover:text-ink'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 구간 반복 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-line px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className={`size-2.5 rounded-full ${loop && repeat ? 'bg-neon-yellow' : 'bg-line'}`} />
            <span className="font-semibold">구간 반복</span>
          </span>
          {loop ? (
            <>
              <span className="font-dot text-base font-black">
                A {formatTime(loop.start)} → B {formatTime(loop.end)}
              </span>
              <span className="text-sm text-dim">({(loop.end - loop.start).toFixed(1)}초)</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setRepeat((v) => !v)}
                  aria-pressed={repeat}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink"
                >
                  {repeat ? '반복 끄기' : '반복 켜기'}
                </button>
                <button
                  type="button"
                  onClick={clearLoop}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink"
                >
                  구간 지우기
                </button>
              </div>
            </>
          ) : (
            <span className="text-sm text-dim">파형 위를 드래그해서 반복할 구간을 선택하세요</span>
          )}
        </div>

        {/* 분석 정보 */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {info.map(({ label, value, warn }) => (
            <div key={label} className="flex flex-col gap-1 bg-panel px-5 py-4">
              <dt className="text-xs font-semibold text-dim">{label}</dt>
              <dd className={`font-dot text-lg font-black ${warn ? 'text-neon-red' : ''}`}>{value}</dd>
            </div>
          ))}
        </dl>
        {a && a.peakDb >= -0.5 && (
          <p className="-mt-3 text-sm font-semibold text-neon-red">
            피크가 0 dB에 닿아 소리가 찌그러졌을 수 있어요. 입력 게인을 조금 낮춰 보세요.
          </p>
        )}
        {a && !a.bpm && (
          <p className="-mt-3 text-sm text-dim">템포는 4초 이상, 박자가 뚜렷한 연주에서 추정돼요.</p>
        )}

        <SaveTakeForm take={take} onSave={onSave} />
      </div>
    </section>
  )
}
