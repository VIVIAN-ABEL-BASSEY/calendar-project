import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { restoreSession } from '../features/auth/authSlice'
import {
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from '../utils/tokenStorage'
import client from '../api/axiosClient'

export default function AuthCallbackPage() {
  const navigate  = useNavigate()
  const dispatch  = useAppDispatch()

  useEffect(() => {
    const handleCallback = async () => {
      // read tokens from URL query params
      const params        = new URLSearchParams(window.location.search)
      const accessToken   = params.get('accessToken')
      const refreshToken  = params.get('refreshToken')
      const userId        = params.get('userId')

      if (!accessToken || !refreshToken || !userId) {
        navigate('/login?error=auth_failed')
        return
      }

      // store tokens
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      try {
        // fetch the full user object using the token
        const { data } = await client.get('/auth/me')
        setStoredUser(data.user)
        dispatch(restoreSession({ accessToken, user: data.user }))
        navigate('/calendar')
      } catch {
        // if /auth/me doesn't exist yet, build a minimal user from what we have
        const minimalUser = { _id: userId }
        setStoredUser(minimalUser)
        dispatch(restoreSession({ accessToken, user: minimalUser }))
        navigate('/calendar')
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      color: 'var(--color-text-muted)',
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        width: 20,
        height: 20,
        border: '2px solid var(--color-border)',
        borderTop: '2px solid var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      Signing you in...
    </div>
  )
}