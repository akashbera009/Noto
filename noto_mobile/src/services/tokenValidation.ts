import MMKVStorage, { StorageKeys } from '../utils/mmkvStorage';
import type { User } from '../utils/types';

/**
 * Checks if a stored auth token exists and is structurally valid.
 * For real JWT validation, decode and check exp claim.
 */
export const tokenValidation = {
  isTokenValid: (): boolean => {
    const token = MMKVStorage.getString(StorageKeys.AUTH_TOKEN);
    return Boolean(token && token.length > 0);
  },

  getStoredUser: (): User | null => {
    return MMKVStorage.getObject<User>(StorageKeys.USER);
  },

  getStoredToken: (): string | null => {
    return MMKVStorage.getString(StorageKeys.AUTH_TOKEN) ?? null;
  },

  clearTokens: (): void => {
    MMKVStorage.remove(StorageKeys.AUTH_TOKEN);
    MMKVStorage.remove(StorageKeys.REFRESH_TOKEN);
    MMKVStorage.remove(StorageKeys.USER);
  },

  /**
   * Decode JWT payload (no signature verification — server handles that).
   */
  decodeToken: (token: string): Record<string, unknown> | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    const payload = tokenValidation.decodeToken(token);
    if (!payload || typeof payload.exp !== 'number') return true;
    return Date.now() / 1000 > payload.exp;
  },
};
