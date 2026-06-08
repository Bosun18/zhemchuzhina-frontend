import { Link } from 'react-router-dom';
import { roomsApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import type { Room } from '../types';

const AMENITIES = ['Кондиционер', 'TV', 'Холодильник', 'Wi-Fi', 'Душ'];

function RoomCard({ room }: { room: Room }) {
  const isDouble = room.type.max_guests >= 4;

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">

      {/* Фото-заглушка */}
      <div className={`h-52 flex items-center justify-center text-6xl ${isDouble ? 'bg-teal-100' : 'bg-blue-100'}`}>
        {isDouble ? '🏠' : '🛏️'}
      </div>

      <div className="p-6 flex flex-col flex-1">

        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold text-gray-800">
            {room.type.name}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full shrink-0">
            №{room.number}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-3">
          {room.floor} этаж · до {room.type.max_guests} гостей
        </p>

        {room.type.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{room.type.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {AMENITIES.map(tag => (
            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${isDouble ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-gray-400 text-sm">Цена по запросу</p>
          <Link
            to="/booking"
            className="bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
          >
            Забронировать
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { data, loading, error } = useFetch<Room[]>(
    () => roomsApi.list(),
    'Не удалось загрузить номера. Попробуйте обновить страницу.',
  );
  const rooms = data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Номера</h1>
        <p className="text-gray-500 text-lg">
          10 номеров на двух этажах · Первая линия · 50м от моря
        </p>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {/* Блок про двор */}
      <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🌿</div>
        <h2 className="text-xl font-bold text-blue-900 mb-2">Общий двор</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          К вашим услугам — крытая терраса, кухня с посудой и газовой плитой, столики.
          Идеально для вечерних посиделок после пляжа.
        </p>
      </div>

    </div>
  );
}
