// src/types/api.types.ts

export interface AuthResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    accountStatus: string
    createdAt: string
    updatedAt: string
    // passwordHash is returned by the backend but we never use it
    passwordHash?: string
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ApiError {
  message: string
  status?: number
}