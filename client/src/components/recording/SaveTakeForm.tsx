import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../lib/auth-context'
import type { Take } from './types'

type SaveTakeFormProps = {
  take: Take
  onSave: (title: string, memo: string) => Promise<void>
}

// 테이크를 서버에 저장 (로그인한 사용자만)
export default function SaveTakeForm({ take, onSave }: SaveTakeFormProps) {
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) {
    return (
      <p className="rounded-2xl border border-line px-5 py-4 text-sm text-dim">
        <Link to="/login" className="font-bold text-neon-pink hover:underline">
          로그인
        </Link>
        하면 녹음을 저장하고 피드에 올릴 수 있어요.
      </p>
    )
  }

  if (take.savedId) {
    return (
      <p className="flex items-center gap-2.5 rounded-2xl border border-line px-5 py-4 text-sm">
        <span className="size-2.5 rounded-full bg-neon-lime" />
        저장했어요.
        <Link to="/feed" className="font-bold text-neon-lime hover:underline">
          피드에서 보기 →
        </Link>
      </p>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSaving(true)
    setError('')
    try {
      await onSave(String(form.get('title')), String(form.get('memo')))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
      <span className="font-semibold">저장하고 피드에 올리기</span>
      <input
        name="title"
        defaultValue={take.name}
        required
        maxLength={100}
        aria-label="제목"
        className="rounded-xl border-2 border-line bg-stage px-4 py-2.5 outline-none focus:border-neon-pink"
      />
      <textarea
        name="memo"
        rows={2}
        placeholder="메모 (어려웠던 부분, 개선할 점 등)"
        aria-label="메모"
        className="resize-none rounded-xl border-2 border-line bg-stage px-4 py-2.5 outline-none placeholder:text-dim/60 focus:border-neon-pink"
      />
      {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}
      <button
        type="submit"
        disabled={saving || !take.analysis}
        className="self-start rounded-full bg-neon-pink px-6 py-2.5 font-bold text-stage disabled:opacity-50"
      >
        {saving ? '저장 중…' : '저장'}
      </button>
    </form>
  )
}
