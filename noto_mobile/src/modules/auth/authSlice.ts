import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../utils/types';
import { loginThunk, logoutThunk, initializeAuth, updateAvatarThunk, getProfileThunk, updateNameThunk } from './authActions';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitializing = false;
    },
    clearError(state) {
      state.error = null;
    },
    hydrateAuth(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setInitializing(state, action: PayloadAction<boolean>) {
      state.isInitializing = action.payload;
    },
  },
  extraReducers: builder => {
    // Initialize
    builder
      .addCase(initializeAuth.pending, state => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, state => {
        state.isInitializing = false;
      })
      .addCase(initializeAuth.rejected, state => {
        state.isInitializing = false;
      });

    // Login
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message as string;
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, state => {
        // Clear auth regardless of API error
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    //get profile
    builder
      .addCase(getProfileThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message as string;
      })

    // Update Avatar
    builder
      .addCase(updateAvatarThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateAvatarThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message as string;
      });

    // Update name
    builder
      .addCase(updateNameThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNameThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateNameThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export const { setUser, setToken, clearAuth, clearError, hydrateAuth, setInitializing } =
  authSlice.actions;
export default authSlice.reducer;
