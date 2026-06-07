export default function ContactsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Контакты</h1>
        <p className="text-gray-500 text-lg">Будем рады ответить на ваши вопросы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Как связаться</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">Телефон</p>
                  <a href="tel:+79999999999" className="text-blue-800 font-semibold hover:underline">
                    +7 (999) 999-99-99
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">WhatsApp</p>
                  <a
                    href="https://wa.me/79999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 font-semibold hover:underline"
                  >
                    Написать в WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">Адрес</p>
                  <p className="text-gray-700">
                    Абхазия, г. Пицунда,<br />
                    район Рыбзавод, первая линия
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Как добраться</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <div className="flex gap-2">
                <span className="shrink-0">✈️</span>
                <p><span className="font-medium">Из аэропорта Сочи</span> — маршрутка или такси до Пицунды (~2,5 часа). Пересечение границы в Псоу.</p>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0">🚂</span>
                <p><span className="font-medium">С ж/д вокзала Адлера</span> — маршрутка до границы, далее транспорт до Пицунды.</p>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0">🚗</span>
                <p><span className="font-medium">На машине</span> — через КПП Псоу, далее по трассе А-160 до Пицунды, район Рыбзавод.</p>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0">🚐</span>
                <p><span className="font-medium">Трансфер</span> — можем организовать встречу. Уточняйте при бронировании.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="rounded-2xl overflow-hidden shadow h-full min-h-[400px]">
          <iframe
            title="Карта"
            src="https://yandex.ru/map-widget/v1/?ll=40.388759%2C43.174874&z=16&pt=40.388759%2C43.174874%2Cpm2rdl"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
}
