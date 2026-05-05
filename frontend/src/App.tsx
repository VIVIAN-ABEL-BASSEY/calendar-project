// src/App.tsx
import { useEffect } from 'react'
import { useAppDispatch } from './app/hooks'
import { restoreSession } from './features/auth/authSlice'
import { getAccessToken } from './utils/tokenStorage'
import AppRouter from './router/AppRouter'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      dispatch(restoreSession({ accessToken, user: null }))
    }
  }, [])

  return <AppRouter />
}