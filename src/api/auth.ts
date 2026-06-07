import { apiClient } from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; phone?: string; city: string; password: string; password_confirmation: string }) =>
    apiClient.post<AuthResponse>('/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/login', data),

  logout: () =>
    apiClient.post('/logout'),

  profile: () =>
    apiClient.get<User>('/profile'),

  updateProfile: (data: Partial<User & { password?: string; password_confirmation?: string }>) =>
    apiClient.put<User>('/profile', data),
};
