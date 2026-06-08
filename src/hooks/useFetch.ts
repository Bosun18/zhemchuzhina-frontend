import { useEffect, useState } from 'react';

// Универсальная загрузка данных с API: возвращает { data, loading, error }.
// Запрос отменяется (флагом) при размонтировании, чтобы не было setState
// после unmount и двойного применения результата в StrictMode.
export function useFetch<T>(
  fetcher: () => Promise<{ data: T }>,
  errorMessage = 'Не удалось загрузить данные.',
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetcher()
      .then(({ data }) => { if (!cancelled) setData(data); })
      .catch(() => { if (!cancelled) setError(errorMessage); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
