import { apiClient } from './apiClient';
import { Endpoints } from '../utils/endpoints';
import type { LoginPayload, LoginResponse, User } from '../utils/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    // Standard OAuth2 password grant requires 'username', 'password', and 'grant_type'
    formData.append('username', payload.email);
    formData.append('password', payload.password);
    formData.append('grant_type', 'password');

    interface OAuth2TokenResponse {
      access_token: string;
      token_type: string;
      refresh_token?: string;
      user?: User;
    }

    const response = await apiClient.post<OAuth2TokenResponse>(Endpoints.auth.login, formData, {
      requiresAuth: false,
    });

    // If API doesn't return user, we'll need to fetch it separately
    let user = response.user;
    if (!user) {
      // Temporary placeholder if user fetch fails or is not included in login
      // A better approach is to call getProfile() if the API doesn't include user
      user = await apiClient.get<User>(Endpoints.user.profile, {
        headers: { Authorization: `Bearer ${response.access_token}` },
        requiresAuth: false,
      });
    }

    return {
      token: response.access_token,
      refreshToken: response.refresh_token ?? '',
      user: user,
    };
  },

  logout: (): Promise<void> =>
    apiClient.post<void>(Endpoints.auth.logout),

  getProfile: (): Promise<User> =>
    apiClient.get<User>(Endpoints.user.profile),

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiClient.post<{ access_token: string }>(Endpoints.auth.refresh, { refreshToken }, {
      requiresAuth: false,
    });
    return { token: response.access_token };
  },

  updateAvatar: async (imagePath: string): Promise<User> => {
    const formData = new FormData();
    // In React Native, FormData requires an object with uri, type, and name for files
    formData.append('profile_image', {
      uri: imagePath,
      type: 'image/jpeg', // Default to jpeg, or detect from extension
      name: 'avatar.jpg',
    } as any);

    return apiClient.put<User>(Endpoints.user.updateProfile, formData
      //   , {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // }
    );
  },
  updateName: async (user_name: string): Promise<User> =>
    apiClient.put<User>(Endpoints.user.updateName, { user_name: user_name }),
};
