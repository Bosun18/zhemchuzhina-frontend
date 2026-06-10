import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi, reviewsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';
import ReviewModal from '../components/ReviewModal';
import Spinner from '../components/Spinner';
import type { Booking, BookingReview, Review } from '../types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${i < rating ? 'bg-yellow-400' : 'bg-gray-200'}`}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}/10</span>
    </div>
  );
}

export default function ReviewsPage() {
  const { isAuthenticated } = useAuth();

  // Свои брони — чтобы предложить оставить отзыв и показать статус pending.
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [bookingsReloadKey, setBookingsReloadKey] = useState(0);
  // Параметры фиксируются на момент открытия, чтобы модалка не
  // размонтировалась на экране «Спасибо», когда после отправки
  // reviewable опустеет.
  const [modal, setModal] = useState<{ bookings: Booking[]; editReview?: BookingReview } | null>(null);

  // Лента перезагружается вместе с бронями: после редактирования
  // approved-отзыв уходит на повторную модерацию и пропадает из ленты.
  const { data, loading, error } = useFetch<Review[]>(
    () => reviewsApi.list(),
    'Не удалось загрузить отзывы.',
    [bookingsReloadKey],
  );
  const reviews = data ?? [];

  useEffect(() => {
    if (!isAuthenticated) {
      setMyBookings([]);
      return;
    }
    let cancelled = false;
    bookingsApi.myBookings()
      .then(({ data }) => { if (!cancelled) setMyBookings(data); })
      .catch(() => {}); // не критично — страница работает и без своих броней
    return () => { cancelled = true; };
  }, [isAuthenticated, bookingsReloadKey]);

  const reviewable = myBookings.filter((b) => b.status === 'confirmed' && !b.review);
  const pendingReviewBooking = myBookings.find((b) => b.review?.status === 'pending');

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <PageHeader
        title="Отзывы гостей"
        maxWidth="max-w-4xl"
        subtitle={avgRating && (
          <>
            Средняя оценка: <span className="text-yellow-400 font-bold text-2xl">{avgRating}</span>
            <span className="text-blue-300">/10</span>
            <span className="text-blue-300 text-sm ml-2">({reviews.length} отзывов)</span>
          </>
        )}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-center">
            <p className="text-blue-800 mb-3">
              Хотите оставить отзыв? Войдите в аккаунт.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
            >
              Войти
            </Link>
          </div>
        )}

        {isAuthenticated && reviewable.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-center">
            <p className="text-blue-800 mb-3">
              Вы жили у нас — поделитесь впечатлениями!
            </p>
            <button
              type="button"
              onClick={() => setModal({ bookings: reviewable })}
              className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
            >
              Оставить отзыв
            </button>
          </div>
        )}

        {isAuthenticated && pendingReviewBooking?.review && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 mb-8 text-sm text-center">
            Ваш отзыв ожидает подтверждения администратором.{' '}
            <button
              type="button"
              onClick={() => setModal({
                bookings: [pendingReviewBooking],
                editReview: pendingReviewBooking.review ?? undefined,
              })}
              className="font-semibold underline hover:text-yellow-900 transition"
            >
              Редактировать
            </button>
          </div>
        )}

        {modal && (
          <ReviewModal
            bookings={modal.bookings}
            editReview={modal.editReview}
            onClose={() => setModal(null)}
            onSubmitted={() => setBookingsReloadKey((k) => k + 1)}
          />
        )}

        {loading && <Spinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-center text-gray-500 py-16">Отзывов пока нет. Будьте первым!</p>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-5">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(review.created_at)}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-600 leading-relaxed">{review.text}</p>
                {review.admin_comment?.trim() && (
                  <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mt-3">
                    <span className="font-medium">Ответ администратора:</span> {review.admin_comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
