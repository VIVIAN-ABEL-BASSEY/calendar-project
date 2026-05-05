// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../../api/auth.api'
import { setAccessToken, setRefreshToken, clearTokens } from '../../utils/tokenStorage'
import type { User } from '../../types/user.types'
import type { LoginPayload, RegisterPayload } from '../../types/api.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null
}

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await loginUser(payload)
      return data
    } catch (err: any) {
      // pull the error message from the backend response if it exists
      return rejectWithValue(err.response?.data?.message ?? 'Login failed')
    }
  }
)

// Async thunk for register
export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await registerUser(payload)
      return data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // called when user manually logs out
    logout(state) {
      state.user = null
      state.accessToken = null
      state.error = null
      clearTokens()
    },
    // called on app load if tokens already exist in storage
    restoreSession(state, action) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        // persist tokens to storage
        setAccessToken(action.payload.accessToken)
        setRefreshToken(action.payload.refreshToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        setAccessToken(action.payload.accessToken)
        setRefreshToken(action.payload.refreshToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, restoreSession } = authSlice.actions
export default authSlice.reducer