// src/utils/tokenStorage.ts

// accessToken lives in sessionStorage — it's cleared when the tab closes
// which is safer since it's short-lived (15 mins in your backend)
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem('accessToken')
}

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem('accessToken', token)
}

// refreshToken lives in localStorage — it needs to survive tab closes
// since it's long-lived (7 days in your backend)
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token)
}

export const clearTokens = (): void => {
  sessionStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}