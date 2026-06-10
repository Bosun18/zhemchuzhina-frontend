import { useState } from 'react';
import { apiClient } from '../api';
import { getErrorMessage } from '../utils/errors';
import { formatDate } from '../utils/format';
import type { Booking } from '../types';

interface ReviewModalProps {
  // Брони, на которые можно оставить отзыв (confirmed без отзыва).
  // Если их несколько — показываем селект выбора брони.
  bookings: Booking[];
  onClose: () => void;
  // Вызывается после успешной отправки — страница перезагружает my-bookings.
  onSubmitted?: () => void;
}

export default function ReviewModal({ bookings, onClose, onSubmitted }: ReviewModalProps) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? 0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // После onSubmitted список броней у родителя может обновиться,
  // поэтому выбранная бронь ищется на каждый рендер.
  const booking = bookings.find((b) => b.id === bookingId);

  const handleSubmit = async () => {
    if (!booking) return;
    if (rating === 0) { setError('Выберите оценку'); return; }
    if (text.trim().length < 10) { setError('Напишите хотя бы пару слов'); return; }
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/reviews', { booking_id: booking.id, rating, text });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Ошибка при отправке отзыва'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {done ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🙏</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Спасибо за отзыв!</h3>
            <p className="text-gray-500 text-sm mb-5">
              Отзыв отправлен на проверку и появится на сайте после одобрения.
            </p>
            <button onClick={onClose} className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Отзыв о проживании</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {bookings.length > 1 ? (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Бронирование</p>
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      №{b.room.number} · {b.room.type} · {formatDate(b.check_in)} → {formatDate(b.check_out)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              booking && (
                <p className="text-sm text-gray-500 mb-4">
                  Номер №{booking.room.number} · {booking.room.type}
                </p>
              )
            )}

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Оценка</p>
              <div className="flex gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                      n <= rating
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Ваш отзыв</p>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                placeholder="Расскажите о своём отдыхе..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Отправляем...' : 'Отправить отзыв'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
