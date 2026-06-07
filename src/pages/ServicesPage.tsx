import { useEffect, useState } from 'react';
import { apiClient } from '../api';
import type { Service } from '../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get<Service[]>('/services')
      .then(({ data }) => setServices(data))
      .catch(() => setError('Не удалось загрузить услуги.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Услуги и акции</h1>
        <p className="text-gray-500 text-lg">Всё для комфортного отдыха</p>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
      )}

      {!loading && !error && services.length === 0 && (
        <p className="text-center text-gray-400 py-16">Услуги скоро появятся.</p>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-2xl shadow p-6 flex gap-4">
              <div className="text-4xl shrink-0">✨</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{service.title}</h3>
                {service.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">{service.description}</p>
                )}
                {service.price && (
                  <p className="text-blue-700 font-semibold">
                    {Number(service.price).toLocaleString('ru-RU')} ₽
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статичные услуги-подсказки если API пустой */}
      {!loading && !error && services.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {[
            { icon: '🚗', title: 'Трансфер', desc: 'Встретим в аэропорту Сочи или на ж/д вокзале Адлера.' },
            { icon: '⛵', title: 'Прогулки на лодке', desc: 'Морские прогулки вдоль побережья.' },
            { icon: '🏔️', title: 'Экскурсии в горы', desc: 'Организуем поездки к достопримечательностям Абхазии.' },
            { icon: '🍽️', title: 'Скидки в кафе', desc: 'Партнёрские скидки в ближайших заведениях.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-6 flex gap-4">
              <div className="text-4xl shrink-0">{icon}</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
