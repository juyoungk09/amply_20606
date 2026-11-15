import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { formatTime, themeColor } from '../../lib/audio'
import LevelMeter from './LevelMeter'

type Status = 'idle' | 'monitoring' | 'recording' | 'paused'

const STATUS_LABEL: Record<Status, { text: string; led: string }> = {
  idle: { text: 'STANDBY', led: 'bg-line' },
  monitoring: { text: 'INPUT', led: 'bg-neon-lime' },
  recording: { text: 'REC', led: 'bg-neon-red' },
  paused: { text: 'PAUSED', led: 'bg-neon-yellow' },
}

type RecorderProps = {
  onRecorded: (blob: Blob) => void
}

export default function Recorder({ onRecorded }: RecorderProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const recordRef = useRef<RecordPlugin | null>(null)
  const onRecordedRef = useRef(onRecorded)

  const [status, setStatus] = useState<Status>('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    onRecordedRef.current = onRecorded
  })

  // 실시간 입력 파형 (wavesurfer 녹음 플러그인)
  useEffect(() => {
    if (!waveRef.current) return

    const record = RecordPlugin.create({
      scrollingWaveform: true,
      scrollingWaveformWindow: 6,
      renderRecordedAudio: false,
    })
    const ws = WaveSurfer.create({
      container: waveRef.current,
      height: 120,
      waveColor: themeColor('--color-neon-red'),
      barWidth: 3,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
      interact: false,
      plugins: [record],
    })

    record.on('record-progress', (ms) => setElapsed(ms / 1000))
    record.on('record-end', (blob) => {
      record.stopMic()
      setStream(null)
      setStatus('idle')
      if (blob.size > 0) onRecordedRef.current(blob)
    })
    recordRef.current = record

    return () => {
      recordRef.current = null
      ws.destroy()
    }
  }, [])

  async function openMic(id = deviceId) {
    const record = recordRef.current
    if (!record) return null
    setError('')
    try {
      const s = await record.startMic(id ? { deviceId: { exact: id } } : undefined)
      setStream(s)
      // 권한을 받은 뒤에야 장치 이름이 보이므로 이때 목록을 갱신
      setDevices(await RecordPlugin.getAvailableAudioDevices())
      if (!id) setDeviceId(s.getAudioTracks()[0]?.getSettings().deviceId ?? '')
      return s
    } catch {
      setError('마이크를 사용할 수 없어요. 브라우저 주소창 옆에서 마이크 권한을 허용해 주세요.')
      return null
    }
  }

  function closeMic() {
    recordRef.current?.stopMic()
    setStream(null)
    setStatus('idle')
  }

  async function toggleMic() {
    if (status === 'idle') {
      if (await openMic()) setStatus('monitoring')
    } else if (status === 'monitoring') {
      closeMic()
    }
  }

  async function changeDevice(id: string) {
    setDeviceId(id)
    if (status === 'monitoring') {
      recordRef.current?.stopMic()
      await openMic(id)
    }
  }

  async function startRecording() {
    const record = recordRef.current
    if (!record) return
    if (!stream && !(await openMic())) return
    setElapsed(0)
    await record.startRecording()
    setStatus('recording')
  }

  function pauseOrResume() {
    const record = recordRef.current
    if (!record) return
    if (status === 'recording') {
      record.pauseRecording()
      setStatus('paused')
    } else if (status === 'paused') {
      record.resumeRecording()
      setStatus('recording')
    }
  }

  function stopRecording() {
    recordRef.current?.stopRecording()
  }

  const busy = status === 'recording' || status === 'paused'
  const label = STATUS_LABEL[status]

  return (
    <section className="panel overflow-hidden">
      {/* 상단 바: 상태 + 입력 장치 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
        <span className="flex items-center gap-2.5">
          <span className={`size-2.5 rounded-full ${label.led}`} />
          <span className="font-dot text-base font-black">{label.text}</span>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="input-device" className="sr-only">
            입력 장치
          </label>
          <select
            id="input-device"
            value={deviceId}
            onChange={(e) => changeDevice(e.target.value)}
            disabled={busy}
            className="max-w-56 rounded-full border border-line bg-stage px-4 py-2 text-sm text-ink disabled:opacity-50"
          >
            {devices.length === 0 && <option value="">기본 마이크</option>}
            {devices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `마이크 ${i + 1}`}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleMic}
            disabled={busy}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink disabled:opacity-50"
          >
            {status === 'idle' ? '입력 확인' : '마이크 끄기'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 p-5 md:grid-cols-[auto_1fr] md:items-center md:gap-12 md:p-8">
        {/* 카운터 + 조작 */}
        <div className="flex flex-col gap-6">
          <span className="font-dot text-6xl leading-none font-black md:text-7xl">{formatTime(elapsed)}</span>

          <div className="flex items-center gap-3">
            {!busy ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-3 rounded-full bg-neon-red py-4 pr-7 pl-5 text-lg font-black text-stage"
              >
                <span className="size-4 rounded-full bg-stage" />
                녹음
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={pauseOrResume}
                  className="rounded-full border-2 border-ink px-6 py-4 text-lg font-black"
                >
                  {status === 'recording' ? '일시정지' : '계속'}
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-3 rounded-full bg-ink py-4 pr-7 pl-5 text-lg font-black text-stage"
                >
                  <span className="size-4 bg-stage" />
                  정지
                </button>
              </>
            )}
          </div>
        </div>

        {/* 입력 파형 + 레벨 */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="relative rounded-2xl border border-line bg-stage px-3">
            <div ref={waveRef} />
            {status === 'idle' && (
              <p className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-stage px-4 text-center text-sm text-dim">
                입력 확인이나 녹음을 누르면 실시간 파형이 표시돼요
              </p>
            )}
          </div>
          <LevelMeter stream={stream} />
        </div>
      </div>

      {error && <p className="border-t border-line px-5 py-3 text-sm font-semibold text-neon-red md:px-8">{error}</p>}
    </section>
  )
}
