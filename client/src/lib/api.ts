// 백엔드 API 호출 도우미

export type User = {
  id: number
  username: string
  nickname: string
  created_at: string
}

/** GET /api/recordings 결과 (recordings JOIN users) */
export type RecordingRow = {
  id: number
  user_id: number
  nickname: string
  title: string
  memo: string | null
  file_path: string
  duration: number | null
  bpm: number | null
  created_at: string
}

const TOKEN_KEY = 'amply-token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** JSON으로 보낼 데이터 */
  json?: unknown
  /** 파일 업로드용 FormData */
  form?: FormData
}

// 토큰이 있으면 자동으로 붙이고, 실패하면 서버가 준 메시지로 에러를 던진다
export async function api<T>(path: string, { method = 'GET', json, form }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {}
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let body: BodyInit | undefined
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    body = form
  }

  const res = await fetch(`/api${path}`, { method, headers, body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? '요청에 실패했어요.')
  return data as T
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })
}
