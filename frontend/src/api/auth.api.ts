import axios from 'axios'
import client from './axiosClient'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/api.types'

export const loginUser = (payload: LoginPayload) =>
  client.post<AuthResponse>('/auth/login', payload).then(r => r.data)

export const registerUser = (payload: RegisterPayload) =>
  client.post<AuthResponse>('/auth/register', payload).then(r => r.data)

export const refreshAccessToken = (refreshToken: string) =>
  axios.post<{ accessToken: string }>('/api/auth/refresh', { refreshToken }).then(r => r.data)

// logout is just a client-side operation for now — clear tokens and redirect
// if your backend has a blacklist endpoint later, call it here
export const logoutUser = () => Promise.resolve()