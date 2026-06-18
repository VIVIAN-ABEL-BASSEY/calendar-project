// src/api/axiosClient.ts
import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens
} from '../utils/tokenStorage'
import { API_BASE_URL } from '../config/apiConfig'

const client = axios.create({
  baseURL: API_BASE_URL
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        })

        setAccessToken(data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return client(originalRequest)

      } catch {
        clearTokens()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default client