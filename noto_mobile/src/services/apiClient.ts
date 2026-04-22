import MMKVStorage, { StorageKeys } from '../utils/mmkvStorage';
import { BASE_URL, Endpoints } from '../utils/endpoints';
import { Constants } from '../utils/constants';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object | URLSearchParams | FormData;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  _retry?: boolean; // Internal use to prevent infinite loops
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: extraHeaders = {},
    requiresAuth = true,
    _retry = false,
  } = options;

  const isUrlSearchParams = body && typeof body === 'object' && body.constructor.name === 'URLSearchParams';
  const isFormData = body && typeof body === 'object' && body.constructor.name === 'FormData';

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  // Only set Content-Type if not FormData (fetch handles boundary automatically)
  if (!isFormData) {
    headers['Content-Type'] = isUrlSearchParams
      ? 'application/x-www-form-urlencoded'
      : 'application/json';
  }

  if (requiresAuth) {
    const token = MMKVStorage.getString(StorageKeys.AUTH_TOKEN);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    Constants.API_TIMEOUT,
  );

  if (__DEV__) {
    console.log(`[API] ${method} ${BASE_URL} ${endpoint}`, { headers, body: body?.toString() ?? body });
  }

  try {
    const final_url = `${BASE_URL}${endpoint}`
    console.log(final_url);
    const response = await fetch(final_url, {
      method,
      headers,
      body: isUrlSearchParams
        ? body.toString()
        : (isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined)),
      signal: controller.signal,
    } as RequestInit);

    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      // Handle Token Refresh
      if (response.status === 401 && requiresAuth && !_retry) {
        const refreshToken = MMKVStorage.getString(StorageKeys.REFRESH_TOKEN);
        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const refreshResponse = await fetch(`${BASE_URL}${Endpoints.auth.refresh}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const { token: newToken } = await refreshResponse.json();
                MMKVStorage.setString(StorageKeys.AUTH_TOKEN, newToken);
                isRefreshing = false;
                onRefreshed(newToken);
              } else {
                throw new Error('Refresh failed');
              }
            } catch (err) {
              isRefreshing = false;
              // Clear auth if refresh fails
              MMKVStorage.remove(StorageKeys.AUTH_TOKEN);
              MMKVStorage.remove(StorageKeys.REFRESH_TOKEN);
              MMKVStorage.remove(StorageKeys.USER);
              throw new ApiError(401, 'Session expired. Please login again.');
            }
          }

          // Wait for refresh and retry
          return new Promise<T>((resolve, reject) => {
            subscribeTokenRefresh(newToken => {
              request<T>(endpoint, { ...options, _retry: true })
                .then(resolve)
                .catch(reject);
            });
          });
        }
      }

      throw new ApiError(
        response.status,
        json?.message ?? `HTTP ${response.status}`,
        json,
      );
    }

    return json as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if ((error as Error).name === 'AbortError') {
      throw new ApiError(408, 'Request timed out. Please try again.');
    }
    throw new ApiError(0, 'Network error. Check your connection.');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: object | URLSearchParams | FormData, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: object | URLSearchParams | FormData, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: object | URLSearchParams | FormData, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };
