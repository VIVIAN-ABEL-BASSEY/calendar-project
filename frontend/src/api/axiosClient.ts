import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens
} from '../utils/tokenStorage'

const client = axios.create({
  baseURL: '/api'
})

// INTERCEPTOR 1: attach the access token to every outgoing request
client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// INTERCEPTOR 2: if we get a 401, try to refresh the token once
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // prevent infinite retry loop

      try {
        const refreshToken = getRefreshToken()

        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken
        })

        setAccessToken(data.accessToken)

        // retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return client(originalRequest)

      } catch {
        // refresh failed — token is expired or invalid, force logout
        clearTokens()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default client