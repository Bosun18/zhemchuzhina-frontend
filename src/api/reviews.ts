import { apiClient } from './client';
import type { BookingReview, Review } from '../types';

export const reviewsApi = {
  list: () =>
    apiClient.get<Review[]>('/reviews'),

  create: (data: { booking_id: number; rating: number; text: string }) =>
    apiClient.post<BookingReview>('/reviews', data),

  // Редактирование своего отзыва: статус снова pending, отзыв уходит
  // на повторную модерацию.
  update: (id: number, data: { rating: number; text: string }) =>
    apiClient.patch<BookingReview>(`/reviews/${id}`, data),
};
