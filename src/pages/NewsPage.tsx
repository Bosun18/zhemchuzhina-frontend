import { Link } from 'react-router-dom';
import { apiClient } from '../api';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import type { NewsItem } from '../types';

export default function NewsPage() {
  const { data, loading, error } = useFetch<NewsItem[]>(
    () => apiClient.get('/news'),
    'Не удалось загрузить новости.',
  );
  const news = data ?? [];

  return (
    <>
      <PageHeader title="Новости и акции" />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Узкая колонка для читаемости, прижатая к левому краю контейнера */}
        <div className="max-w-4xl">
          {loading && <Spinner />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
          )}

          {!loading && !error && news.length === 0 && (
            <p className="text-center text-gray-500 py-16">Новостей пока нет.</p>
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
      </div>
    </>
  );
}
