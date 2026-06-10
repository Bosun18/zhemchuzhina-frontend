import { useEffect, useState } from 'react';
import { bookingsApi, roomsApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BookingForm from '../components/BookingForm';
import PageHeader from '../components/PageHeader';
import { dateStr, addDays, todayStr } from '../utils/dates';
import { formatDate } from '../utils/format';
import type { Booking, CalendarRoom, CalendarBooking } from '../types';

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

// getDay(): 0 — воскресенье. Подписи столбцов.
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Ширина колонки дня фиксирована — на ней построено и абсолютное
// позиционирование полос броней, и горизонтальный скролл сетки.
const DAY_W = 44;

type CellStatus = 'past' | 'free' | 'busy';

// Статус ячейки = занятость номера в конкретную ночь.
// Ночь check_out уже свободна, поэтому строгое day < check_out.
function cellStatus(room: CalendarRoom, day: string): CellStatus {
  if (day < todayStr) return 'past';
  for (const b of room.bookings) {
    if (b.check_in <= day && day < b.check_out) return 'busy';
  }
  return 'free';
}

// Все ночи полуинтервала [from, to) свободны. Сама ночь to не проверяется:
// в день выезда номер уже может заселяться заново (выезд до 12:00, заезд после 14:00).
function isRangeFree(room: CalendarRoom, from: string, to: string): boolean {
  for (let d = from; d < to; d = addDays(d, 1)) {
    if (cellStatus(room, d) !== 'free') return false;
  }
  return true;
}

interface DayRange {
  start: number; // индекс первой занятой ночи в days
  span: number;  // число занятых ночей в видимом диапазоне
}

// Обрезает полуинтервал ночей [from, to) по видимым дням месяца.
// null — диапазон целиком вне видимого месяца.
function rangeSpan(from: string, to: string, days: string[]): DayRange | null {
  const start = days.findIndex((d) => d >= from);
  if (start === -1) return null;
  const afterEnd = days.findIndex((d) => d >= to);
  const end = (afterEnd === -1 ? days.length : afterEnd) - 1;
  if (end < start) return null;
  return { start, span: end - start + 1 };
}

export interface BookingBar extends DayRange {
  status: CalendarBooking['status'];
}

// Чистая функция: брони + дни месяца -> полосы для отрисовки.
// Соседние брони (выезд и заезд в один день) не пересекаются: полоса
// занимает только ночи [check_in, check_out), а зазор даёт отступ при рендере.
export function bookingBars(bookings: CalendarBooking[], days: string[]): BookingBar[] {
  const bars: BookingBar[] = [];
  for (const b of bookings) {
    const range = rangeSpan(b.check_in, b.check_out, days);
    if (range) bars.push({ ...range, status: b.status });
  }
  // pending рисуем первыми, чтобы при пересечении confirmed оказался сверху
  return bars.sort((a, b) => (a.status === b.status ? 0 : a.status === 'pending' ? -1 : 1));
}

const barClasses: Record<CalendarBooking['status'], string> = {
  pending: 'bg-amber-300',
  confirmed: 'bg-rose-400',
};

export default function BookingPage() {
  const { isAuthenticated } = useAuth();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkOutDate, setCheckOutDate] = useState(addDays(todayStr, 1));
  const [success, setSuccess] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayDates = days.map((d) => dateStr(year, month, d));
  const dows = days.map((d) => new Date(year, month, d).getDay());
  const from = dayDates[0];
  const to = dayDates[daysInMonth - 1];

  const { data, loading, error } = useFetch<CalendarRoom[]>(
    () => roomsApi.calendar({ from, to }),
    'Не удалось загрузить календарь. Попробуйте обновить страницу.',
    [year, month, reloadKey],
  );
  const rooms = data ?? [];

  // Свои pending-брони — баннеры «ожидает подтверждения» под формой.
  // reloadKey в зависимостях: после успешной брони список обновляется
  // вместе с календарём.
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMyBookings([]);
      return;
    }
    let cancelled = false;
    bookingsApi.myBookings()
      .then(({ data }) => { if (!cancelled) setMyBookings(data); })
      .catch(() => {}); // не критично — календарь и форма работают и без баннеров
    return () => { cancelled = true; };
  }, [isAuthenticated, reloadKey]);

  const pendingBookings = myBookings.filter((b) => b.status === 'pending');

  // Выбранный в форме диапазон — подсветка в сетке (ночи [заезд, выезд)).
  const selectedRange = rangeSpan(checkInDate, checkOutDate, dayDates);

  // Через date-инпуты можно выбрать диапазон поверх чужой брони —
  // в этом состоянии показываем предупреждение и блокируем сабмит.
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;
  const rangeConflict =
    selectedRoom !== null && !isRangeFree(selectedRoom, checkInDate, checkOutDate);

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSuccess(false);
  };

  const handleBookingSuccess = () => {
    setSuccess(true);
    setReloadKey((k) => k + 1); // перезагрузить календарь
    // Сбрасываем выбор: иначе только что созданная бронь конфликтует
    // с оставшимся в форме диапазоном и сразу загорается предупреждение.
    setSelectedRoomId(null);
    setCheckInDate(todayStr);
    setCheckOutDate(addDays(todayStr, 1));
  };

  // Клик правее заезда по той же строке — дата выезда, если все ночи
  // [checkInDate, ds) свободны. Статус самой ночи ds не важен: она в
  // проживание не входит, так что выезд в день чужого заезда допустим.
  const isCheckOutPick = (room: CalendarRoom, ds: string) =>
    room.id === selectedRoomId && ds > checkInDate && isRangeFree(room, checkInDate, ds);

  // Клик по свободной ячейке: первый — номер и дата заезда, второй —
  // дата выезда (см. isCheckOutPick). Любой другой клик по свободной
  // ячейке начинает выбор заново.
  const handleCellClick = (room: CalendarRoom, ds: string) => {
    if (isCheckOutPick(room, ds)) {
      setCheckOutDate(ds);
      return;
    }
    if (cellStatus(room, ds) !== 'free') return;
    setSelectedRoomId(room.id);
    setCheckInDate(ds);
    setCheckOutDate(addDays(ds, 1));
  };

  const gridTemplate = `170px repeat(${days.length}, ${DAY_W}px)`;

  return (
    <>
      <PageHeader title="Бронирование" maxWidth="max-w-7xl" align="left">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Предыдущий месяц"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 text-blue-900 text-lg font-bold transition"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-blue-100 min-w-[150px] text-center">
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
      </PageHeader>
      <div className="max-w-7xl mx-auto px-4 py-12">

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 text-center">
            Ваша заявка принята! Ожидайте подтверждения на почте.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Календарь — на мобильных идёт вторым (под формой) */}
          <div className="order-2 lg:order-1 min-w-0">

            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
              Кликните по свободным датам в календаре или заполните форму.
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
                    {days.map((day, i) => {
                      const isToday = dayDates[i] === todayStr;
                      const isWeekend = dows[i] === 0 || dows[i] === 6;
                      return (
                        <div
                          key={day}
                          className={`border-b border-r border-gray-200 py-2 text-center ${
                            isToday ? 'bg-blue-100' : isWeekend ? 'bg-gray-100' : ''
                          }`}
                        >
                          <div className={`text-sm font-semibold ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                            {day}
                          </div>
                          <div className={`text-[10px] ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                            {WEEKDAYS[dows[i]]}
                          </div>
                        </div>
                      );
                    })}

                    {/* Строки по номерам */}
                    {rooms.map((room) => {
                      const isSelected = room.id === selectedRoomId;
                      const bars = bookingBars(room.bookings, dayDates);
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

                          {/* Дни строки + полосы броней поверх ячеек */}
                          <div className="relative" style={{ gridColumn: '2 / -1' }}>
                            <div
                              className="grid"
                              style={{ gridTemplateColumns: `repeat(${days.length}, ${DAY_W}px)` }}
                            >
                              {days.map((day, i) => {
                                const ds = dayDates[i];
                                const status = cellStatus(room, ds);
                                const isToday = ds === todayStr;
                                const isWeekend = dows[i] === 0 || dows[i] === 6;
                                const clickable = status === 'free' || isCheckOutPick(room, ds);
                                const bg =
                                  status === 'past' ? 'bg-gray-100'
                                  : isToday ? 'bg-blue-50'
                                  : isWeekend ? 'bg-gray-50'
                                  : 'bg-white';
                                return (
                                  <div
                                    key={day}
                                    title={ds}
                                    onClick={clickable ? () => handleCellClick(room, ds) : undefined}
                                    className={`h-12 border-b border-r border-gray-100 ${bg} ${
                                      clickable ? 'cursor-pointer hover:bg-blue-50' : ''
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            {/* Полосы броней: одна на диапазон, с зазором по краям */}
                            {bars.map((bar, i) => (
                              <div
                                key={i}
                                className={`pointer-events-none absolute top-2 h-8 rounded-lg ${barClasses[bar.status]}`}
                                style={{ left: bar.start * DAY_W + 2, width: bar.span * DAY_W - 4 }}
                              />
                            ))}

                            {/* Подсветка выбранного в форме диапазона */}
                            {isSelected && selectedRange && (
                              <div
                                className={`pointer-events-none absolute top-1 bottom-1 rounded-lg border-2 ${
                                  rangeConflict
                                    ? 'border-amber-500 bg-amber-400/30'
                                    : 'border-blue-500 bg-blue-400/20'
                                }`}
                                style={{
                                  left: selectedRange.start * DAY_W + 1,
                                  width: selectedRange.span * DAY_W - 2,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Легенда */}
                <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-white border border-gray-300" /> Свободно</span>
                  <span className="flex items-center gap-2"><span className="w-5 h-3 rounded-md bg-amber-300" /> Ожидает подтверждения</span>
                  <span className="flex items-center gap-2"><span className="w-5 h-3 rounded-md bg-rose-400" /> Занято</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-400/20" /> Ваш выбор</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-100 border border-gray-200" /> Прошедшие даты</span>
                </div>
              </>
            )}
          </div>

          {/* Форма — на мобильных идёт первой, на десктопе sticky справа */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6">
            {rangeConflict && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                В выбранном диапазоне есть занятые даты. Выберите другие даты.
              </div>
            )}
            <BookingForm
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onRoomChange={setSelectedRoomId}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInChange={setCheckInDate}
              onCheckOutChange={setCheckOutDate}
              isAuthenticated={isAuthenticated}
              submitDisabled={rangeConflict}
              onSuccess={handleBookingSuccess}
            />

            {pendingBookings.map((b) => (
              <div
                key={b.id}
                className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 mt-4 text-sm"
              >
                Бронирование №{b.id} на даты {formatDate(b.check_in)} → {formatDate(b.check_out)} ожидает
                подтверждения администратором.
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
