import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthHeading from '../components/ui/AuthHeading'
import TextField from '../components/ui/TextField'
import { useAuth } from '../lib/auth-context'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    setSubmitting(true)
    setError('')
    try {
      await login(String(form.get('username')), String(form.get('password')))
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <AuthHeading title="로그인" description="다시 만나서 반가워요. 연습을 이어가 볼까요?" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
        <TextField label="아이디" name="username" autoComplete="username" required />
        <TextField label="비밀번호" name="password" type="password" autoComplete="current-password" required />

        {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded-full bg-neon-pink py-4 text-lg font-bold text-stage disabled:opacity-50 md:py-5 md:text-xl"
        >
          {submitting ? '로그인 중…' : '로그인'}
        </button>
      </form>

      <p className="text-center text-dim">
        아직 계정이 없나요?{' '}
        <Link to="/register" className="font-bold text-neon-pink hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
