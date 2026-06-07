import { apiClient } from './client';
import type { Room } from '../types';

export const roomsApi = {
  list: () =>
    apiClient.get<Room[]>('/rooms'),

  show: (id: number) =>
    apiClient.get<Room>(`/rooms/${id}`),

  availability: (id: number, params: { check_in: string; check_out: string }) =>
    apiClient.get<{ available: boolean; booked_dates: string[] }>(`/rooms/${id}/availability`, { params }),
};
