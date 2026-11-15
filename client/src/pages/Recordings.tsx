import { useEffect, useRef, useState } from 'react'
import CompareView from '../components/recording/CompareView'
import Recorder from '../components/recording/Recorder'
import TakeList from '../components/recording/TakeList'
import TakePlayer from '../components/recording/TakePlayer'
import type { Take } from '../components/recording/types'
import { api } from '../lib/api'
import { analyzeBlob, fileExtension } from '../lib/audio'

export default function Recordings() {
  const [takes, setTakes] = useState<Take[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const counterRef = useRef(0)
  const takesRef = useRef(takes)

  useEffect(() => {
    takesRef.current = takes
  }, [takes])

  // 페이지를 떠날 때 blob URL 정리
  useEffect(() => () => takesRef.current.forEach((t) => URL.revokeObjectURL(t.url)), [])

  function addTake(blob: Blob) {
    counterRef.current += 1
    const take: Take = {
      id: crypto.randomUUID(),
      name: `TAKE ${String(counterRef.current).padStart(2, '0')}`,
      blob,
      url: URL.createObjectURL(blob),
      createdAt: new Date(),
      analysis: null,
    }
    setTakes((prev) => [take, ...prev])
    setSelectedId(take.id)

    analyzeBlob(blob)
      .then((analysis) => setTakes((prev) => prev.map((t) => (t.id === take.id ? { ...t, analysis } : t))))
      .catch(() => {
        /* 분석 실패 시 정보 칸은 '분석 중'으로 남는다 */
      })
  }

  // 테이크를 서버에 업로드 (POST /api/recordings)
  async function saveTake(take: Take, title: string, memo: string) {
    const form = new FormData()
    form.append('audio', take.blob, `take.${fileExtension(take.blob.type)}`)
    form.append('title', title)
    form.append('memo', memo)
    if (take.analysis) {
      form.append('duration', String(take.analysis.duration))
      if (take.analysis.bpm) form.append('bpm', String(take.analysis.bpm))
    }
    const { id } = await api<{ id: number }>('/recordings', { method: 'POST', form })
    setTakes((prev) => prev.map((t) => (t.id === take.id ? { ...t, savedId: id } : t)))
  }

  function deleteTake(id: string) {
    const target = takes.find((t) => t.id === id)
    if (!target) return
    URL.revokeObjectURL(target.url)
    const rest = takes.filter((t) => t.id !== id)
    setTakes(rest)
    setCompareIds((ids) => ids.filter((x) => x !== id))
    if (selectedId === id) setSelectedId(rest[0]?.id ?? null)
  }

  function toggleCompare(id: string) {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id)
      return [...ids, id].slice(-2) // 최대 두 개, 넘치면 오래된 것부터 빠짐
    })
  }

  const selected = takes.find((t) => t.id === selectedId) ?? null
  const [compareA, compareB] = compareIds.map((id) => takes.find((t) => t.id === id))

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">녹음</h1>
        <p className="text-dim md:text-lg">연주를 녹음하고, 구간을 반복해 듣고, 이전 연주와 비교해 보세요.</p>
      </div>

      <Recorder onRecorded={addTake} />

      {takes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line px-6 py-14 text-center text-dim">
          아직 녹음한 테이크가 없어요. 위에서 <span className="font-bold text-neon-red">녹음</span>을 눌러 시작하세요.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <TakeList
            takes={takes}
            selectedId={selectedId}
            compareIds={compareIds}
            onSelect={setSelectedId}
            onToggleCompare={toggleCompare}
          />
          {selected && (
            <TakePlayer
              key={selected.id}
              take={selected}
              onDelete={() => deleteTake(selected.id)}
              onSave={(title, memo) => saveTake(selected, title, memo)}
            />
          )}
        </div>
      )}

      {compareA && compareB && <CompareView a={compareA} b={compareB} />}

      <p className="text-sm text-dim">
        저장하지 않은 테이크는 이 페이지를 벗어나면 사라져요. 남기고 싶은 테이크는 저장하거나 다운로드해 두세요.
      </p>
    </div>
  )
}
