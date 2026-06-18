import axios from 'axios'
import client from './axiosClient'
import { API_BASE_URL } from '../config/apiConfig'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/api.types'

export const loginUser = (payload: LoginPayload) =>
  client.post<AuthResponse>('/auth/login', payload).then(r => r.data)

export const registerUser = (payload: RegisterPayload) =>
  client.post<AuthResponse>('/auth/register', payload).then(r => r.data)

export const refreshAccessToken = (refreshToken: string) =>
  axios.post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, { refreshToken }).then(r => r.data)

export const logoutUser = () => Promise.resolve()