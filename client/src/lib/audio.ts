// 녹음 파일 분석 + 표시용 포맷 함수

export type AudioAnalysis = {
  duration: number
  sampleRate: number
  channels: number
  /** 가장 큰 순간 음량 (dBFS, 0이 최대) */
  peakDb: number
  /** 평균 음량 (dBFS) */
  rmsDb: number
  /** 추정 템포. 너무 짧거나 박자가 불분명하면 null */
  bpm: number | null
}

export async function analyzeBlob(blob: Blob): Promise<AudioAnalysis> {
  const ctx = new AudioContext()
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer())
    const mono = mixToMono(buffer)

    let peak = 0
    let sumSquares = 0
    for (let i = 0; i < mono.length; i++) {
      const v = Math.abs(mono[i])
      if (v > peak) peak = v
      sumSquares += v * v
    }
    const rms = Math.sqrt(sumSquares / mono.length)

    return {
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      peakDb: toDb(peak),
      rmsDb: toDb(rms),
      bpm: estimateBpm(mono, buffer.sampleRate),
    }
  } finally {
    ctx.close()
  }
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  const out = new Float32Array(buffer.length)
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < data.length; i++) out[i] += data[i] / buffer.numberOfChannels
  }
  return out
}

export function toDb(amplitude: number) {
  return amplitude > 0 ? 20 * Math.log10(amplitude) : -Infinity
}

/**
 * 간단한 템포 추정
 * 1) 짧은 구간마다 에너지를 구하고, 에너지가 갑자기 커지는 지점(어택)을 뽑는다
 * 2) 어택 신호의 자기상관으로 가장 규칙적으로 반복되는 간격을 찾는다 (60~200 BPM 범위)
 */
function estimateBpm(data: Float32Array, sampleRate: number): number | null {
  const hop = 512
  const frameRate = sampleRate / hop
  const frames = Math.floor(data.length / hop)

  const minLag = Math.floor((frameRate * 60) / 200)
  const maxLag = Math.ceil((frameRate * 60) / 60)
  // 최소 4박 이상 들어갈 길이가 있어야 추정
  if (frames < maxLag * 4) return null

  const onset = new Float32Array(frames)
  let prev = 0
  for (let f = 0; f < frames; f++) {
    let energy = 0
    for (let i = f * hop; i < (f + 1) * hop; i++) energy += data[i] * data[i]
    onset[f] = Math.max(0, energy - prev)
    prev = energy
  }

  let mean = 0
  for (const v of onset) mean += v
  mean /= frames
  for (let f = 0; f < frames; f++) onset[f] -= mean

  let bestLag = 0
  let best = 0
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0
    for (let f = 0; f + lag < frames; f++) sum += onset[f] * onset[f + lag]
    if (sum > best) {
      best = sum
      bestLag = lag
    }
  }
  if (!bestLag) return null

  return Math.round((60 * frameRate) / bestLag)
}

export function formatTime(seconds: number, tenths = true) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const base = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return tenths ? `${base}.${Math.floor((seconds * 10) % 10)}` : base
}

export function formatDb(db: number) {
  if (!Number.isFinite(db)) return '-∞ dB'
  return `${db > 0.05 ? '+' : ''}${db.toFixed(1)} dB`
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/** audio/webm;codecs=opus → webm */
export function fileExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a'
  if (mimeType.includes('mpeg')) return 'mp3'
  if (mimeType.includes('wav')) return 'wav'
  return 'webm'
}

/** Canvas처럼 CSS 클래스를 못 쓰는 곳에서 테마 색을 읽어 온다 */
export function themeColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
