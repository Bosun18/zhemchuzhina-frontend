import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi, bookingsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { parseValidationErrors } from '../utils/errors';
import { formatDate } from '../utils/format';
import Field from '../components/Field';
import ReviewModal from '../components/ReviewModal';
import Spinner from '../components/Spinner';
import type { Booking } from '../types';

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function StatusBadge({ status }: { status: Booking['status'] }) {
  const map = {
    pending:   { label: 'Ожидает подтверждения', cls: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Подтверждено',           cls: 'bg-green-100 text-green-800'  },
    cancelled: { label: 'Отменено',               cls: 'bg-red-100 text-red-800'      },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function nightsCount(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(diff / 86400000);
}

// ─── Вкладка: Бронирования ────────────────────────────────────────────────────

function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [reviewModal, setReviewModal] = useState<Booking | null>(null);

  const loadBookings = () =>
    bookingsApi.myBookings()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Отменить бронирование?')) return;
    setCancelling(id);
    try {
      const { data } = await bookingsApi.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? data : b));
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <Spinner size="md" className="py-16" />;

  if (bookings.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-5xl mb-4">🏖️</p>
      <p className="text-lg">У вас пока нет бронирований.</p>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-bold text-gray-800 text-lg">
                  Номер №{booking.room.number} — {booking.room.type}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                  {' · '}{nightsCount(booking.check_in, booking.check_out)} ночей
                  {' · '}{booking.guests_count} гостей
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            {booking.comment && (
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Ваш комментарий:</span> {booking.comment}
              </p>
            )}
            {booking.admin_comment?.trim() && (
              <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mb-3">
                <span className="font-medium">Ответ администратора:</span> {booking.admin_comment}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancelling === booking.id}
                  className="text-sm border border-red-300 text-red-600 hover:bg-red-50 px-4 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {cancelling === booking.id ? 'Отменяем...' : 'Отменить'}
                </button>
              )}
              {booking.status === 'confirmed' && !booking.review && (
                <button
                  onClick={() => setReviewModal(booking)}
                  className="text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-1.5 rounded-lg transition"
                >
                  Оставить отзыв
                </button>
              )}
              {booking.review?.status === 'pending' && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Отзыв ожидает подтверждения
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviewModal && (
        <ReviewModal
          bookings={[reviewModal]}
          onClose={() => setReviewModal(null)}
          onSubmitted={loadBookings}
        />
      )}
    </>
  );
}

// ─── Вкладка: Профиль ─────────────────────────────────────────────────────────

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true);

    const payload: Record<string, string> = {
      name: form.name,
      city: form.city,
    };
    if (form.phone) payload.phone = form.phone;
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    try {
      const { data } = await authApi.updateProfile(payload);
      updateUser(data);
      setSuccess(true);
      setForm(f => ({ ...f, password: '', password_confirmation: '' }));
    } catch (err) {
      setErrors(parseValidationErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <Field label="Имя и фамилия" name="name" value={form.name} error={errors.name} onChange={v => set('name', v)} />
      <Field label="Телефон (WhatsApp)" name="phone" placeholder="+7 (999) 999-99-99" value={form.phone} error={errors.phone} onChange={v => set('phone', v)} />
      <Field label="Город" name="city" value={form.city} error={errors.city} onChange={v => set('city', v)} />

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-3">Смена пароля — оставьте пустым, если не хотите менять</p>
        <div className="space-y-3">
          <Field label="Новый пароль" name="password" type="password" value={form.password} error={errors.password} onChange={v => set('password', v)} />
          <Field label="Повторите пароль" name="password_confirmation" type="password" value={form.password_confirmation} error={errors.password_confirmation} onChange={v => set('password_confirmation', v)} />
        </div>
      </div>

      {success && (
        <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Профиль обновлён ✓
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Сохраняем...' : 'Сохранить изменения'}
      </button>
    </form>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function AccountPage() {
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState<'bookings' | 'profile'>('bookings');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Личный кабинет</h1>
        <p className="text-gray-500 mt-1">{user?.name} · {user?.email}</p>
      </div>

      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
        {([
          ['bookings', 'Бронирования'],
          ['profile',  'Профиль'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === key
                ? 'bg-white text-blue-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'bookings' ? <BookingsTab /> : <ProfileTab />}

    </div>
  );
}
