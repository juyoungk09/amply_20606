import type { AudioAnalysis } from '../../lib/audio'

/** 한 번 녹음한 결과 (테이크) */
export type Take = {
  id: string
  name: string
  blob: Blob
  /** 재생·다운로드용 blob URL */
  url: string
  createdAt: Date
  /** 분석이 끝나기 전에는 null */
  analysis: AudioAnalysis | null
  /** 서버에 저장했으면 그 녹음의 id */
  savedId?: number
}
