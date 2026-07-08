import { useEffect } from 'react'
import { useAppDispatch } from './app/hooks'
import { logout } from './features/auth/authSlice'
import { getAccessToken, getRefreshToken, setAccessToken } from './utils/tokenStorage'
import { refreshAccessToken } from './api/auth.api'
import { useDarkMode } from './hooks/useDarkMode'
import AppRouter from './router/AppRouter'

function isTokenExpired(token: string): boolean {
  try {
    // JWT is three base64 parts separated by dots
    // the middle part is the payload containing the expiry
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const validateSession = async () => {
      const accessToken  = getAccessToken()
      const refreshToken = getRefreshToken()

      // no tokens at all — nothing to do, let the router redirect to login
      if (!accessToken || !refreshToken) return

      // access token still valid — nothing to do
      if (!isTokenExpired(accessToken)) return

      // access token expired — try to get a new one using the refresh token
      try {
        const data = await refreshAccessToken(refreshToken)
        setAccessToken(data.accessToken)
      } catch {
        // refresh token also expired — force logout
        dispatch(logout())
      }
    }

    validateSession()
  }, [])
  useDarkMode()
  return <AppRouter />
}