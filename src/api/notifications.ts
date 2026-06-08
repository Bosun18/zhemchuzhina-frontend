import { apiClient } from './client';
import type { Notification } from '../types';

export const notificationsApi = {
  list: () =>
    apiClient.get<Notification[]>('/notifications'),

  unreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.patch<{ status: string }>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.post<{ status: string }>('/notifications/read-all'),
};
