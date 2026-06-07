import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Review } from '../types';

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get<Review[]>('/reviews')
      .then(({ data }) => setReviews(data))
      .catch(() => setError('Не удалось загрузить отзывы.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Отзывы гостей</h1>
        {avgRating && (
          <p className="text-gray-500 text-lg">
            Средняя оценка: <span className="text-yellow-500 font-bold text-2xl">{avgRating}</span>
            <span className="text-gray-400">/10</span>
            <span className="text-gray-400 text-sm ml-2">({reviews.length} отзывов)</span>
          </p>
        )}
      </div>

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

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-center text-gray-400 py-16">Отзывов пока нет. Будьте первым!</p>
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
  );
}
