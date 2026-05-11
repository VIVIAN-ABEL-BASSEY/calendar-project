export const getAccessToken = (): string | null =>
  localStorage.getItem('accessToken')

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken')

export const setAccessToken = (token: string): void =>
  localStorage.setItem('accessToken', token)

export const setRefreshToken = (token: string): void =>
  localStorage.setItem('refreshToken', token)

export const setStoredUser = (user: object): void =>
  localStorage.setItem('user', JSON.stringify(user))

export const getStoredUser = (): object | null => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}