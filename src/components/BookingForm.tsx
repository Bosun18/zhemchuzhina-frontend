import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../api';
import { getErrorMessage } from '../utils/errors';
import { addDays, todayStr } from '../utils/dates';
import type { CalendarRoom } from '../types';

interface BookingFormProps {
  rooms: CalendarRoom[];
  selectedRoomId: number | null;
  onRoomChange: (id: number | null) => void;
  // Даты живут в BookingPage — выбор в календаре и форма синхронизированы.
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  isAuthenticated: boolean;
  // Блокировка сабмита извне (например, диапазон пересекает чужую бронь) —
  // сама проверка живёт в BookingPage.
  submitDisabled: boolean;
  onSuccess: () => void;
}

export default function BookingForm({
  rooms,
  selectedRoomId,
  onRoomChange,
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  isAuthenticated,
  submitDisabled,
  onSuccess,
}: BookingFormProps) {
  const [guestsCount, setGuestsCount] = useState(1);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;
  const maxGuests = selectedRoom?.type.max_guests ?? 1;

  // Минимальная дата выезда — следующий день после заезда.
  const minCheckOut = addDays(checkInDate, 1);

  const handleCheckIn = (value: string) => {
    onCheckInChange(value);
    // Не даём дате выезда оказаться раньше или равной заезду.
    if (checkOutDate <= value) onCheckOutChange(addDays(value, 1));
  };

  const handleRoomChange = (value: string) => {
    const id = value ? Number(value) : null;
    onRoomChange(id);
    // Подгоняем число гостей под вместимость нового номера.
    const room = rooms.find((r) => r.id === id);
    if (room && guestsCount > room.type.max_guests) {
      setGuestsCount(room.type.max_guests);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowLogin(false);

    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (!selectedRoom) {
      setError('Выберите номер.');
      return;
    }
    if (checkOutDate <= checkInDate) {
      setError('Дата выезда должна быть позже даты заезда.');
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        room_id: selectedRoom.id,
        check_in: checkInDate,
        check_out: checkOutDate,
        guests_count: guestsCount,
        comment: comment.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось создать бронирование. Попробуйте ещё раз.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-blue-900">Забронировать номер</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Выберите номер</label>
        <select
          value={selectedRoomId ?? ''}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Выберите номер —</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              №{room.number} · {room.type.name} · {room.floor} эт.
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Дата заезда</label>
          <input
            type="date"
            value={checkInDate}
            min={todayStr}
            onChange={(e) => handleCheckIn(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Дата выезда</label>
          <input
            type="date"
            value={checkOutDate}
            min={minCheckOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Количество гостей{' '}
          {selectedRoom && <span className="text-gray-400">(до {maxGuests})</span>}
        </label>
        <input
          type="number"
          value={guestsCount}
          min={1}
          max={maxGuests}
          onChange={(e) => setGuestsCount(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Комментарий <span className="text-gray-400">(необязательно)</span>
        </label>
        <textarea
          value={comment}
          rows={3}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Пожелания, время заезда и т.п."
        />
      </div>

      {showLogin && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm">
          <Link to="/login" className="font-semibold underline">Войдите в аккаунт</Link>, чтобы забронировать.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || submitDisabled}
        className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition"
      >
        {submitting ? 'Отправка…' : 'Забронировать'}
      </button>
    </form>
  );
}
