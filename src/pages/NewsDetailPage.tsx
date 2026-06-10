import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import type { NewsItem } from '../types';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, loading, error } = useFetch<NewsItem>(
    () => apiClient.get(`/news/${id}`),
    'Новость не найдена.',
    [id],
  );

  return (
    <>
      {item && (
        <PageHeader
          title={item.title}
          subtitle={formatDate(item.published_at)}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Узкая колонка для читаемости, прижатая к левому краю контейнера */}
        <div className="max-w-3xl">
          <Link to="/news" className="text-blue-700 hover:underline text-sm mb-6 inline-block">
            ← Все новости
          </Link>

          {loading && <Spinner />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
          )}

          {item && (
            <article>
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full rounded-2xl mb-8 shadow" />
              )}
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{item.content}</div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
