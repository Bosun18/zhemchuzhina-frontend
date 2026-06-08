import { apiClient } from './client';
import type { Room } from '../types';

export const roomsApi = {
  list: () =>
    apiClient.get<Room[]>('/rooms'),

  show: (id: number) =>
    apiClient.get<Room>(`/rooms/${id}`),

  // GET /rooms/availability?check_in&check_out — список активных номеров,
  // каждый с дополнительным полем is_available на выбранные даты.
  availability: (params: { check_in: string; check_out: string }) =>
    apiClient.get<(Room & { is_available: boolean })[]>('/rooms/availability', { params }),
};
