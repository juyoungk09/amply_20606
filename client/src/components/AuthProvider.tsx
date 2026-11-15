import { useEffect, useState, type ReactNode } from 'react'
import { api, tokenStore, type User } from '../lib/api'
import { AuthContext } from '../lib/auth-context'

// 로그인 상태를 앱 전체에 공유한다
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStore.get() !== null)

  // 새로고침해도 로그인이 유지되도록, 저장된 토큰으로 내 정보를 다시 불러온다
  useEffect(() => {
    if (!tokenStore.get()) return
    api<User>('/users/me')
      .then(setUser)
      .catch(() => tokenStore.clear()) // 만료된 토큰은 버린다
      .finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string) {
    const data = await api<{ token: string; user: User }>('/users/login', {
      method: 'POST',
      json: { username, password },
    })
    tokenStore.set(data.token)
    setUser(data.user)
  }

  function logout() {
    tokenStore.clear()
    setUser(null)
  }

  return <AuthContext value={{ user, loading, login, logout, setUser }}>{children}</AuthContext>
}
