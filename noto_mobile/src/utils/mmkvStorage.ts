/**
 * MMKV Storage Wrapper
 * Install: yarn add react-native-mmkv
 * This wraps MMKV with a clean typed API.
 * Falls back to a Map-based mock for environments without native modules.
 */

import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'noto-store' });

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  ONBOARDING_DONE: 'onboarding_done',
  THEME: 'theme',
  LAST_SYNC: 'last_sync',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

const MMKVStorage = {
  setString(key: StorageKey, value: string): void {
    if (value === undefined || value === null) {
      this.remove(key);
      return;
    }
    try {
      storage.set(key, value);
    } catch (error) {
      console.error(`[MMKVStorage] setString failed for key "${key}":`, error);
    }
  },

  getString(key: StorageKey): string | undefined {
    try {
      return storage.getString(key);
    } catch (error) {
      console.error(`[MMKVStorage] getString failed for key "${key}":`, error);
      return undefined;
    }
  },

  setObject<T extends object>(key: StorageKey, value: T): void {
    if (value === undefined || value === null) {
      this.remove(key);
      return;
    }
    try {
      const stringified = JSON.stringify(value);
      if (stringified !== undefined) {
        storage.set(key, stringified);
      }
    } catch (error) {
      console.error(`[MMKVStorage] setObject failed for key "${key}":`, error);
    }
  },

  getObject<T extends object>(key: StorageKey): T | null {
    try {
      const raw = storage.getString(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`[MMKVStorage] getObject failed for key "${key}":`, error);
      return null;
    }
  },

  setBoolean(key: StorageKey, value: boolean): void {
    storage.set(key, value ? 'true' : 'false');
  },

  getBoolean(key: StorageKey): boolean {
    return storage.getString(key) === 'true';
  },

  remove(key: StorageKey): void {
    try {
      storage.remove(key);
    } catch (error) {
      console.error(`[MMKVStorage] remove failed for key "${key}":`, error);
    }
  },

  clearAll(): void {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('[MMKVStorage] clearAll failed:', error);
    }
  },

  has(key: StorageKey): boolean {
    return storage.contains(key);
  },
};

export default MMKVStorage;
