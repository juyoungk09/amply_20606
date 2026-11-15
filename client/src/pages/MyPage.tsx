import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import TextField from '../components/ui/TextField'
import { api, type RecordingRow, type User } from '../lib/api'
import { useAuth } from '../lib/auth-context'

export default function MyPage() {
  const { user, loading, setUser, logout } = useAuth()
  const [myCount, setMyCount] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [withdrawn, setWithdrawn] = useState(false)

  // 내가 올린 녹음 수 (전체 목록에서 내 것만 센다)
  useEffect(() => {
    if (!user) return
    api<RecordingRow[]>('/recordings')
      .then((rows) => setMyCount(rows.filter((r) => r.user_id === user.id).length))
      .catch(() => {})
  }, [user])

  if (withdrawn) return <Navigate to="/" replace /> // 탈퇴하면 홈으로
  if (loading) return <p className="text-dim">불러오는 중…</p>
  if (!user) return <Navigate to="/login" replace /> // 로그인 안 했으면 로그인 페이지로

  // [Update] PUT /api/users/me
  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const password = String(form.get('password'))

    setMessage('')
    setError('')
    if (password !== form.get('passwordConfirm')) {
      setError('새 비밀번호가 일치하지 않아요.')
      return
    }
    try {
      const updated = await api<User>('/users/me', {
        method: 'PUT',
        json: { nickname: form.get('nickname'), password: password || undefined },
      })
      setUser(updated)
      formEl.reset()
      setMessage('프로필을 수정했어요.')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // [Delete] DELETE /api/users/me
  async function handleWithdraw() {
    if (!window.confirm('정말 탈퇴할까요? 올린 녹음도 모두 삭제되고 되돌릴 수 없어요.')) return
    try {
      await api('/users/me', { method: 'DELETE' })
      setWithdrawn(true)
      logout()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h1 className="text-4xl font-black tracking-tight md:text-6xl">마이페이지</h1>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* [Read] 프로필 */}
        <section className="panel flex flex-col gap-6 p-6 lg:self-start">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-3xl font-black">
              <span className="size-3 rounded-full bg-neon-blue" />
              {user.nickname}
            </span>
            <span className="text-dim">@{user.username}</span>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            <div className="flex flex-col gap-1 bg-panel px-4 py-3">
              <dt className="text-xs font-semibold text-dim">가입일</dt>
              <dd className="font-semibold">{new Date(user.created_at).toLocaleDateString('ko-KR')}</dd>
            </div>
            <div className="flex flex-col gap-1 bg-panel px-4 py-3">
              <dt className="text-xs font-semibold text-dim">올린 녹음</dt>
              <dd className="font-dot text-lg font-black">{myCount ?? '-'}</dd>
            </div>
          </dl>
          <Link to="/feed" className="font-semibold text-neon-yellow hover:underline">
            피드에서 내 녹음 보기 →
          </Link>
        </section>

        <div className="flex flex-col gap-6">
          {/* 프로필 수정 */}
          <section className="panel p-6">
            <h2 className="mb-5 text-xl font-black">프로필 수정</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <TextField label="닉네임" name="nickname" defaultValue={user.nickname} required maxLength={30} key={user.nickname} />
              <TextField
                label="새 비밀번호 (바꿀 때만 입력)"
                name="password"
                type="password"
                autoComplete="new-password"
              />
              <TextField label="새 비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" />

              {message && <p className="text-sm font-semibold text-neon-lime">{message}</p>}
              {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}

              <button type="submit" className="self-start rounded-full bg-neon-blue px-6 py-3 font-bold text-stage">
                저장
              </button>
            </form>
          </section>

          {/* 회원 탈퇴 */}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-neon-red/40 p-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-black">회원 탈퇴</h2>
              <p className="text-sm text-dim">계정과 올린 녹음이 모두 삭제돼요.</p>
            </div>
            <button
              type="button"
              onClick={handleWithdraw}
              className="rounded-full border-2 border-neon-red px-5 py-2.5 font-bold text-neon-red hover:bg-neon-red hover:text-stage"
            >
              탈퇴하기
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
