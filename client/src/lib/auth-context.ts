import { createContext, useContext } from 'react'
import type { User } from './api'

export type AuthValue = {
  /** 로그인한 회원, 아니면 null */
  user: User | null
  /** 새로고침 직후 저장된 토큰으로 회원 정보를 불러오는 중 */
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  /** 프로필 수정 후 화면 정보 갱신 */
  setUser: (user: User) => void
}

export const AuthContext = createContext<AuthValue | null>(null)

// 어느 컴포넌트에서든 로그인 상태를 꺼내 쓰는 훅
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider 안에서만 사용할 수 있어요.')
  return value
}
