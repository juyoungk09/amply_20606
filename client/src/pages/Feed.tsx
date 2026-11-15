import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import FeedItem from '../components/feed/FeedItem'
import { api, type RecordingRow } from '../lib/api'
import { useAuth } from '../lib/auth-context'

// 모든 사용자가 올린 녹음 목록 (recordings JOIN users)
export default function Feed() {
  const { user } = useAuth()
  const [rows, setRows] = useState<RecordingRow[] | null>(null)
  const [error, setError] = useState('')

  // [Read] GET /api/recordings
  useEffect(() => {
    api<RecordingRow[]>('/recordings')
      .then(setRows)
      .catch((err: Error) => setError(err.message))
  }, [])

  function updateRow(id: number, title: string, memo: string | null) {
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, title, memo } : r)) ?? null)
  }

  function removeRow(id: number) {
    setRows((prev) => prev?.filter((r) => r.id !== id) ?? null)
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">피드</h1>
          <p className="text-dim md:text-lg">Amply 연주자들이 올린 녹음을 들어 보세요.</p>
        </div>
        {rows && <span className="font-dot text-lg font-black text-dim">{rows.length} TAKES</span>}
      </div>

      {error && <p className="font-semibold text-neon-red">{error}</p>}
      {!rows && !error && <p className="text-dim">불러오는 중…</p>}

      {rows?.length === 0 && (
        <div className="rounded-3xl border border-dashed border-line px-6 py-14 text-center text-dim">
          아직 올라온 녹음이 없어요.{' '}
          <Link to="/recordings" className="font-bold text-neon-red hover:underline">
            첫 녹음을 올려 보세요
          </Link>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {rows.map((r) => (
            <FeedItem
              key={r.id}
              recording={r}
              isMine={r.user_id === user?.id}
              onUpdated={(title, memo) => updateRow(r.id, title, memo)}
              onDeleted={() => removeRow(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
