import { useState } from 'react';
import { roomsApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BookingForm from '../components/BookingForm';
import type { CalendarRoom } from '../types';

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

// getDay(): 0 — воскресенье. Подписи столбцов.
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const pad = (v: number) => String(v).padStart(2, '0');
const dateStr = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const todayStr = (() => {
  const now = new Date();
  return dateStr(now.getFullYear(), now.getMonth(), now.getDate());
})();

type CellStatus = 'past' | 'free' | 'pending' | 'confirmed';

// Статус ячейки = занятость номера в конкретный день.
// confirmed важнее pending; прошедшие дни недоступны в любом случае.
function cellStatus(room: CalendarRoom, day: string): CellStatus {
  if (day < todayStr) return 'past';
  let pending = false;
  for (const b of room.bookings) {
    if (b.check_in <= day && day < b.check_out) {
      if (b.status === 'confirmed') return 'confirmed';
      if (b.status === 'pending') pending = true;
    }
  }
  return pending ? 'pending' : 'free';
}

const cellClasses: Record<CellStatus, string> = {
  past: 'bg-gray-100 text-gray-400',
  free: 'bg-green-100',
  pending: 'bg-yellow-200',
  confirmed: 'bg-red-200',
};

export default function BookingPage() {
  const { isAuthenticated } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const from = dateStr(year, month, 1);
  const to = dateStr(year, month, daysInMonth);

  const { data, loading, error } = useFetch<CalendarRoom[]>(
    () => roomsApi.calendar({ from, to }),
    'Не удалось загрузить календарь. Попробуйте обновить страницу.',
    [year, month, reloadKey],
  );
  const rooms = data ?? [];

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSuccess(false);
  };

  const handleBookingSuccess = () => {
    setSuccess(true);
    setReloadKey((k) => k + 1); // перезагрузить календарь
  };

  // Ширина колонки дня фиксирована — сетка скроллится по горизонтали.
  const gridTemplate = `170px repeat(${days.length}, 44px)`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-blue-900">Бронирование</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Предыдущий месяц"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 text-blue-900 text-lg font-bold transition"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-gray-700 min-w-[150px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Следующий месяц"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 text-blue-900 text-lg font-bold transition"
          >
            →
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 text-center">
          Ваша заявка принята! Ожидайте подтверждения на почте.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* Календарь — на мобильных идёт вторым (под формой) */}
        <div className="order-2 lg:order-1 min-w-0">

          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <span className="lg:hidden">Выберите номер и даты в форме ниже ↓</span>
            <span className="hidden lg:inline">Выберите номер и даты в форме справа →</span>
          </p>

          {loading && <Spinner />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
              {error}
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <p className="text-center text-gray-400 py-16">Номера временно недоступны.</p>
          )}

          {!loading && !error && rooms.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <div className="inline-grid" style={{ gridTemplateColumns: gridTemplate }}>

                  {/* Шапка: пустой угол + дни месяца */}
                  <div className="sticky left-0 z-10 bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 flex items-end">
                    Номер
                  </div>
                  {days.map((day) => {
                    const dow = new Date(year, month, day).getDay();
                    return (
                      <div key={day} className="border-b border-gray-200 py-2 text-center">
                        <div className="text-sm font-semibold text-gray-700">{day}</div>
                        <div className="text-[10px] text-gray-400">{WEEKDAYS[dow]}</div>
                      </div>
                    );
                  })}

                  {/* Строки по номерам */}
                  {rooms.map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    return (
                      <div key={room.id} className="contents">
                        <div
                          className={`sticky left-0 z-10 border-b border-r border-gray-200 px-3 py-2 flex flex-col justify-center transition ${
                            isSelected ? 'bg-blue-100' : 'bg-white'
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-800">№{room.number}</span>
                          <span className="text-xs text-gray-400">{room.type.name} · {room.floor} эт.</span>
                        </div>
                        {days.map((day) => {
                          const ds = dateStr(year, month, day);
                          const status = cellStatus(room, ds);
                          return (
                            <div
                              key={day}
                              title={ds}
                              className={`border-b border-gray-100 h-12 ${cellClasses[status]} ${
                                isSelected ? 'ring-1 ring-blue-300 ring-inset' : ''
                              }`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Легенда */}
              <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-100 border border-green-200" /> Свободно</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-200" /> Ожидает подтверждения</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-200" /> Занято</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-100 border border-gray-200" /> Прошедшие даты</span>
              </div>
            </>
          )}
        </div>

        {/* Форма — на мобильных идёт первой, на десктопе sticky справа */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-6">
          <BookingForm
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onRoomChange={setSelectedRoomId}
            isAuthenticated={isAuthenticated}
            onSuccess={handleBookingSuccess}
          />
        </div>

      </div>
    </div>
  );
}
