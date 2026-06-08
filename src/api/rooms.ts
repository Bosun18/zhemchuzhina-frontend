import { apiClient } from './client';
import type { Room, CalendarRoom } from '../types';

export const roomsApi = {
  list: () =>
    apiClient.get<Room[]>('/rooms'),

  show: (id: number) =>
    apiClient.get<Room>(`/rooms/${id}`),

  // GET /rooms/availability?check_in&check_out — список активных номеров,
  // каждый с дополнительным полем is_available на выбранные даты.
  availability: (params: { check_in: string; check_out: string }) =>
    apiClient.get<(Room & { is_available: boolean })[]>('/rooms/availability', { params }),

  // GET /rooms/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD — активные номера
  // вместе с бронями, пересекающими период (для сетки занятости).
  calendar: (params: { from: string; to: string }) =>
    apiClient.get<CalendarRoom[]>('/rooms/calendar', { params }),
};
