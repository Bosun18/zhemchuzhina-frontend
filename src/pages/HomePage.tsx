import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export default function HomePage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative h-[90vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
        <img
          src={heroImg}
          alt="Гостевой дом Жемчужина"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-3">
            Пицунда · Абхазия
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight drop-shadow">
            Гостевой дом<br />«Жемчужина»
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 drop-shadow">
            Первая линия. 50 метров до моря.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/booking"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition text-lg shadow-lg"
            >
              Забронировать
            </Link>
            <Link
              to="/rooms"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold px-8 py-3 rounded-xl transition text-lg border border-white/40"
            >
              Смотреть номера
            </Link>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🌊', title: '50 метров до моря', desc: 'Первая линия. Выходите из ворот — и вы уже на берегу.' },
              { icon: '🏡', title: 'Свой двор', desc: 'Крытая терраса, кухня, столики — место чтобы собраться всей семьёй.' },
              { icon: '❄️', title: 'Все удобства', desc: 'Кондиционер, TV, холодильник, Wi-Fi в каждом номере.' },
              { icon: '📅', title: 'Онлайн-бронирование', desc: 'Выбирайте даты и номер прямо на сайте, без звонков.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center px-2">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* НОМЕРА */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">Номера</h2>
          <p className="text-center text-gray-500 mb-12">
            Всего 10 номеров — уютно и без суеты большой гостиницы
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="h-56 bg-blue-100 flex items-center justify-center text-6xl">🛏️</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Стандартный номер</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Двуспальная кровать, диван, собственный санузел с душем.
                  Кондиционер, TV, холодильник, Wi-Fi. На 1–3 гостей.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Кондиционер', 'TV', 'Холодильник', 'Wi-Fi', 'Душ'].map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <Link to="/rooms" className="text-blue-700 font-medium hover:underline text-sm">
                  Подробнее и бронирование →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="h-56 bg-teal-100 flex items-center justify-center text-6xl">🏠</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Двухкомнатный номер</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Две комнаты — спальня и гостиная. Подходит для семьи
                  или компании до 4–5 человек. Больше пространства и приватности.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['2 комнаты', 'Кондиционер', 'TV', 'Холодильник', 'Wi-Fi', 'Душ'].map(tag => (
                    <span key={tag} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <Link to="/rooms" className="text-blue-700 font-medium hover:underline text-sm">
                  Подробнее и бронирование →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* О ПИЦУНДЕ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Пицунда — жемчужина Абхазии</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            Пицунда известна своим реликтовым сосновым бором, чистым морем и мягким климатом.
            Именно здесь находится наш гостевой дом — в тихом районе Рыбзавод, на первой линии,
            в 50 метрах от галечного пляжа.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mb-10">
            Вокруг — горы, реликтовый лес, озеро Инкит. Рядом рестораны, рынок и все удобства
            курортного посёлка. Идеальное место для спокойного семейного отдыха.
          </p>
          <Link
            to="/contacts"
            className="inline-block border border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Как добраться
          </Link>
        </div>
      </section>

      {/* ОТЗЫВЫ — анонс */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="text-3xl font-bold mb-4">Нам доверяют гости</h2>
          <p className="text-blue-200 text-lg mb-8">
            Читайте отзывы тех, кто уже побывал у нас, или поделитесь своим впечатлением.
          </p>
          <Link
            to="/reviews"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition"
          >
            Читать отзывы
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Готовы отдохнуть?</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Выберите даты и забронируйте номер онлайн. Мы подтвердим бронирование в течение нескольких часов.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition text-lg shadow-md"
          >
            Забронировать номер
          </Link>
        </div>
      </section>

    </div>
  );
}
