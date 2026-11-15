import { useState, type FormEvent } from 'react'
import { api, formatDate, type RecordingRow } from '../../lib/api'
import { formatTime } from '../../lib/audio'

type FeedItemProps = {
  recording: RecordingRow
  /** 로그인한 사용자가 올린 녹음이면 수정·삭제 버튼을 보여 준다 */
  isMine: boolean
  onUpdated: (title: string, memo: string | null) => void
  onDeleted: () => void
}

export default function FeedItem({ recording: r, isMine, onUpdated, onDeleted }: FeedItemProps) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  // [Update] PUT /api/recordings/:id
  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = String(form.get('title'))
    const memo = String(form.get('memo')) || null
    try {
      await api(`/recordings/${r.id}`, { method: 'PUT', json: { title, memo } })
      onUpdated(title, memo)
      setEditing(false)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // [Delete] DELETE /api/recordings/:id
  async function handleDelete() {
    if (!window.confirm(`'${r.title}' 녹음을 삭제할까요?`)) return
    try {
      await api(`/recordings/${r.id}`, { method: 'DELETE' })
      onDeleted()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <article className="panel flex flex-col gap-4 p-6">
      {/* 작성자 + 날짜 (users 테이블에서 JOIN한 닉네임) */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <span className={`size-2 rounded-full ${isMine ? 'bg-neon-pink' : 'bg-neon-yellow'}`} />
          {r.nickname}
          {isMine && <span className="text-xs text-neon-pink">(나)</span>}
        </span>
        <span className="text-dim">{formatDate(r.created_at)}</span>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input
            name="title"
            defaultValue={r.title}
            required
            maxLength={100}
            aria-label="제목"
            className="rounded-xl border-2 border-line bg-stage px-4 py-2.5 text-lg font-bold outline-none focus:border-neon-pink"
          />
          <textarea
            name="memo"
            defaultValue={r.memo ?? ''}
            rows={3}
            aria-label="메모"
            className="resize-none rounded-xl border-2 border-line bg-stage px-4 py-2.5 outline-none focus:border-neon-pink"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-neon-pink px-5 py-2 text-sm font-bold text-stage">
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-dim hover:text-ink"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black break-words">{r.title}</h2>
          {r.memo && <p className="whitespace-pre-line text-dim">{r.memo}</p>}
        </div>
      )}

      <div className="flex gap-4 font-dot text-sm font-black text-dim">
        {r.duration != null && <span>{formatTime(r.duration)}</span>}
        {r.bpm != null && <span>{r.bpm} BPM</span>}
      </div>

      <audio controls preload="none" src={`/uploads/${r.file_path}`} className="w-full" />

      {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}

      {isMine && !editing && (
        <div className="flex gap-2 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:text-ink"
          >
            수정
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-dim hover:border-neon-red hover:text-neon-red"
          >
            삭제
          </button>
        </div>
      )}
    </article>
  )
}
