import { apiClient } from './client';
import type { Booking } from '../types';

export const bookingsApi = {
  myBookings: () =>
    apiClient.get<Booking[]>('/my-bookings'),

  create: (data: { room_id: number; check_in: string; check_out: string; guests_count: number; comment?: string }) =>
    apiClient.post<Booking>('/bookings', data),

  cancel: (id: number) =>
    apiClient.delete<Booking>(`/bookings/${id}`),
};
