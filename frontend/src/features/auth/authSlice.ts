import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../../api/auth.api'
import {
  setAccessToken,
  setRefreshToken,
  setStoredUser,
  getAccessToken,
  getStoredUser,
  clearTokens
} from '../../utils/tokenStorage'
import type { User } from '../../types/user.types'
import type { LoginPayload, RegisterPayload } from '../../types/api.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}

// read from storage synchronously before anything renders
const storedToken = getAccessToken()
const storedUser  = getStoredUser() as User | null

const initialState: AuthState = {
  user:        storedToken && storedUser ? storedUser : null,
  accessToken: storedToken && storedUser ? storedToken : null,
  isLoading:   false,
  error:       null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await loginUser(payload)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await registerUser(payload)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.accessToken = null
      state.error = null
      clearTokens()
    },
    restoreSession(state, action) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        setAccessToken(action.payload.accessToken)
        setRefreshToken(action.payload.refreshToken)
        setStoredUser(action.payload.user)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
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
        setStoredUser(action.payload.user)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, restoreSession } = authSlice.actions
export default authSlice.reducer