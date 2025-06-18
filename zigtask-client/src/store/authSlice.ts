import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, SignupData, SigninData } from '../types';
import { authApi } from '../utils/api';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

// Load initial state from localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    initialState.user = user;
    initialState.token = token;
    initialState.isAuthenticated = true;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (data: SigninData, { rejectWithValue }) => {
    try {
      const response = await authApi.signin(data);
      const {  accessToken, user } = response.data.data;
      // Store in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user.fullName));

      return { user, token: accessToken };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signin failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      })
      // Signin
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 