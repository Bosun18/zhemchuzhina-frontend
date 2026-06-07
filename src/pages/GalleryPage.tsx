import { useEffect, useState } from 'react';
import { apiClient } from '../api';
import type { GalleryItem } from '../types';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    apiClient.get<GalleryItem[]>('/gallery')
      .then(({ data }) => setItems(data))
      .catch(() => setError('Не удалось загрузить галерею.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Галерея</h1>
        <p className="text-gray-500">Фотографии гостевого дома, номеров и окрестностей</p>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-400 py-16">Фотографии скоро появятся.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.caption || 'Фото'}
                className="w-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Лайтбокс */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-4xl max-h-full relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <img src={selected.image} alt={selected.caption || ''} className="max-h-[85vh] rounded-xl object-contain" />
            {selected.caption && (
              <p className="text-white text-center mt-3 text-sm">{selected.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
