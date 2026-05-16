import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import MMKVStorage, { StorageKeys } from '../../utils/mmkvStorage';
import type { LoginPayload, LoginResponse, SignupPayload, SignupResponse, User } from '../../utils/types';
import Strings from '../../utils/strings';
import { hydrateAuth, clearAuth } from './authSlice';

export const initializeAuth = createAsyncThunk<
  void,
  void,
  { rejectValue: { status: number; message: string } }
>(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = MMKVStorage.getString(StorageKeys.AUTH_TOKEN);
      const user = MMKVStorage.getObject<User>(StorageKeys.USER);

      if (token && user) {
        // Hydrate state immediately
        dispatch(hydrateAuth({ token, user }));

        // Validate token with a silent profile fetch or similar
        try {
          // This ensures the token is actually valid on the server
          // If it fails with 401, apiClient will handle refresh automatically
          await authService.getProfile();
        } catch (error: any) {
          // If refresh also failed, we are already logged out by apiClient
          return rejectWithValue({
            status: error?.status ?? 0,
            message: error?.message ?? 'Initialization failed',
          });
        }
      }
    } catch (error: any) {
      dispatch(clearAuth());
      return rejectWithValue({
        status: error?.status ?? 0,
        message: error?.message ?? 'Initialization failed',
      });
    }
  },
);

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { status: number; message: string } }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.login(payload);
    // Persist tokens
    MMKVStorage.setString(StorageKeys.AUTH_TOKEN, response.token);
    MMKVStorage.setString(StorageKeys.REFRESH_TOKEN, response.refreshToken);
    MMKVStorage.setObject(StorageKeys.USER, response.user);
    return response;
  } catch (error: any) {
    console.error('[LoginThunk Error]', error);
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.status === 401
        ? Strings.errors.invalidCredentials
        : error?.data?.detail ?? error?.message ?? Strings.errors.generic,
    });
  }
});
export const signupThunk = createAsyncThunk<
  SignupResponse,                                        // ← was LoginResponse
  SignupPayload,
  { rejectValue: { status: number; message: string } }
>('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.signup(payload);
    // No tokens returned — just store the user if needed
    MMKVStorage.setObject(StorageKeys.USER, response);
    return response;
  } catch (error: any) {
    console.error('[SignupThunk Error]', error);
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.status === 409
        ? Strings.errors.emailAlreadyExists
        : error?.data?.detail ?? error?.message ?? Strings.errors.generic,
    });
  }
});
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: { status: number; message: string } }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      // Intentionally ignore API errors on logout but return status for middleware
      return rejectWithValue({
        status: error?.status ?? 0,
        message: error?.message ?? 'Logout failed',
      });
    } finally {
      MMKVStorage.remove(StorageKeys.AUTH_TOKEN);
      MMKVStorage.remove(StorageKeys.REFRESH_TOKEN);
      MMKVStorage.remove(StorageKeys.USER);
    }
  },
);
export const getProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: { status: number; message: string } }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getProfile();
    console.log('[GetProfileThunk Success]', user);
    return user;
  } catch (error: any) {
    console.error('[GetProfileThunk Error]', error);
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.data?.detail ?? error?.message ?? Strings.errors.generic,
    });
  }
});

export const updateAvatarThunk = createAsyncThunk<
  User,
  string,
  { rejectValue: { status: number; message: string } }
>('auth/updateAvatar', async (imagePath, { rejectWithValue }) => {
  try {
    const updatedUser = await authService.updateAvatar(imagePath);
    // Update persisted user
    MMKVStorage.setObject(StorageKeys.USER, updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error('[UpdateAvatarThunk Error]', error);
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.data?.detail ?? error?.message ?? Strings.errors.generic,
    });
  }
});


export const updateNameThunk = createAsyncThunk<
  User,
  { user_name?: string; avatar?: string },
  { rejectValue: { status: number; message: string } }
>('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const updatedUser = await authService.updateName(data.user_name || '');
    MMKVStorage.setObject(StorageKeys.USER, updatedUser);
    return updatedUser;
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.data?.detail ?? error?.message ?? Strings.errors.generic,
    });
  }
});