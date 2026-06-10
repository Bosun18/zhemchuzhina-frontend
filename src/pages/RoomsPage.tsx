import { useState } from 'react';
import { Link } from 'react-router-dom';
import { roomsApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import type { Room, RoomType } from '../types';

const AMENITIES = ['Кондиционер', 'TV', 'Холодильник', 'Wi-Fi', 'Душ'];

// Склонение «гость / гостя / гостей» по числу.
function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

// Агрегированная группа номеров одного типа.
interface RoomGroup {
  type: RoomType;
  count: number;
  maxGuests: number;
  floors: number[];
}

function groupByType(rooms: Room[]): RoomGroup[] {
  const map = new Map<number, RoomGroup>();
  for (const room of rooms) {
    const existing = map.get(room.type.id);
    if (existing) {
      existing.count += 1;
      existing.maxGuests = Math.max(existing.maxGuests, room.type.max_guests);
      if (!existing.floors.includes(room.floor)) existing.floors.push(room.floor);
    } else {
      map.set(room.type.id, {
        type: room.type,
        count: 1,
        maxGuests: room.type.max_guests,
        floors: [room.floor],
      });
    }
  }
  return Array.from(map.values());
}

function PhotoCarousel({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const total = photos.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="relative h-52 bg-gray-100">
      <img src={photos[index]} alt={name} className="w-full h-full object-cover" />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-blue-900 text-xl font-bold shadow transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-blue-900 text-xl font-bold shadow transition"
          >
            ›
          </button>
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {index + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}

function RoomTypeCard({ group }: { group: RoomGroup }) {
  const { type, count, maxGuests, floors } = group;
  const photos = type.photos ?? [];
  const isDouble = maxGuests >= 4;

  const floorsLabel = [...floors].sort((a, b) => a - b).join('–');

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">

      {photos.length > 0 ? (
        <PhotoCarousel photos={photos} name={type.name} />
      ) : (
        <div className={`h-52 flex items-center justify-center text-6xl ${isDouble ? 'bg-teal-100' : 'bg-blue-100'}`}>
          {isDouble ? '🏠' : '🛏️'}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">

        <h3 className="text-xl font-bold text-gray-800 mb-1">{type.name}</h3>

        <p className="text-sm text-gray-400 mb-3">
          {count} {plural(count, ['номер', 'номера', 'номеров'])} · до {maxGuests}{' '}
          {plural(maxGuests, ['гостя', 'гостей', 'гостей'])} · {floorsLabel}{' '}
          {plural(floors.length, ['этаж', 'этажа', 'этаж'])}
        </p>

        {type.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{type.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {AMENITIES.map((tag) => (
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
  const groups = groupByType(data ?? []);

  return (
    <>
      <PageHeader
        title="Номера"
        subtitle="10 номеров на двух этажах · Первая линия · 50м от моря"
        maxWidth="max-w-6xl"
      />
      <div className="max-w-6xl mx-auto px-4 py-12">

        {loading && <Spinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
            {error}
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <p className="text-center text-gray-500 py-16">Номера временно недоступны.</p>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {groups.map((group) => (
              <RoomTypeCard key={group.type.id} group={group} />
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
    </>
  );
}
