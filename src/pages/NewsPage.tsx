import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api';
import type { NewsItem } from '../types';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get<NewsItem[]>('/news')
      .then(({ data }) => setNews(data))
      .catch(() => setError('Не удалось загрузить новости.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Новости и акции</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="text-center text-gray-400 py-16">Новостей пока нет.</p>
      )}

      {!loading && !error && news.length > 0 && (
        <div className="space-y-6">
          {news.map(item => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="block bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full h-52 object-cover" />
              )}
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-2">{formatDate(item.published_at)}</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-800 transition">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.content}</p>
                <span className="inline-block mt-3 text-blue-700 text-sm font-medium hover:underline">
                  Читать далее →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
