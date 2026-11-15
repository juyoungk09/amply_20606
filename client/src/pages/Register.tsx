import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthHeading from '../components/ui/AuthHeading'
import TextField from '../components/ui/TextField'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth-context'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const username = String(form.get('username'))
    const password = String(form.get('password'))

    if (password !== form.get('passwordConfirm')) {
      setPasswordError('비밀번호가 일치하지 않아요.')
      return
    }
    setPasswordError('')
    setError('')
    setSubmitting(true)
    try {
      await api('/users/register', {
        method: 'POST',
        json: { username, password, nickname: form.get('nickname') },
      })
      await login(username, password) // 가입 후 바로 로그인
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <AuthHeading title="회원가입" description="Amply와 함께 연습을 기록해 보세요." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
        <TextField label="아이디" name="username" autoComplete="username" required maxLength={30} />
        <TextField label="닉네임" name="nickname" autoComplete="nickname" required maxLength={30} />
        <TextField label="비밀번호" name="password" type="password" autoComplete="new-password" required maxLength={100} />
        <TextField
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          error={passwordError}
        />

        {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 rounded-full bg-neon-pink py-4 text-lg font-bold text-stage disabled:opacity-50 md:py-5 md:text-xl"
        >
          {submitting ? '가입 중…' : '가입하기'}
        </button>
      </form>

      <p className="text-center text-dim">
        이미 계정이 있나요?{' '}
        <Link to="/login" className="font-bold text-neon-pink hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
