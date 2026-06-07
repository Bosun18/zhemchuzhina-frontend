import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api';
import type { NewsItem } from '../types';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get<NewsItem>(`/news/${id}`)
      .then(({ data }) => setItem(data))
      .catch(() => setError('Новость не найдена.'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/news" className="text-blue-700 hover:underline text-sm mb-6 inline-block">
        ← Все новости
      </Link>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
      )}

      {item && (
        <article>
          {item.image && (
            <img src={item.image} alt={item.title} className="w-full rounded-2xl mb-8 shadow" />
          )}
          <p className="text-gray-400 text-sm mb-3">{formatDate(item.published_at)}</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-6">{item.title}</h1>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{item.content}</div>
        </article>
      )}
    </div>
  );
}
