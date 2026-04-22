import { Platform } from 'react-native';

export const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000'
  : 'http://127.0.0.1:8000';

export const Endpoints = {
  // Auth
  auth: {
    login: '/auth/jwt/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
  },

  // Notes
  notes: {
    list: '/notes/',
    create: '/notes/',
    detail: (id: string) => `/notes/${id}`,
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
    explain: (id: string) => `/notes/${id}/explain`,
  },

  // AI
  ai: {
    explain: (id: string) => `/ai/explain/${id}`,
    summarize: (id: string) => `/ai/summarize/${id}`,
  },

  // User
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    updateName: '/user/profile/name/',
  },
} as const;
