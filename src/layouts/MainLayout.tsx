import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-wide">
            🌊 Жемчужина
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-200 transition">Главная</Link>
            <Link to="/rooms" className="hover:text-blue-200 transition">Номера</Link>
            <Link to="/booking" className="hover:text-blue-200 transition">Бронирование</Link>
            <Link to="/services" className="hover:text-blue-200 transition">Услуги</Link>
            <Link to="/news" className="hover:text-blue-200 transition">Новости</Link>
            <Link to="/gallery" className="hover:text-blue-200 transition">Галерея</Link>
            <Link to="/reviews" className="hover:text-blue-200 transition">Отзывы</Link>
            <Link to="/contacts" className="hover:text-blue-200 transition">Контакты</Link>
          </nav>
          <div className="flex gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/account" className="hover:text-blue-200 transition">
                  👤 {user?.name}
                </Link>
                <button onClick={handleLogout} className="hover:text-blue-200 transition">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">Войти</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="font-semibold text-white mb-1">Гостевой дом «Жемчужина»</p>
          <p>Абхазия, Пицунда, район Рыбзавод · Первая линия, 50м от моря</p>
          <p className="mt-2">📞 +7 (999) 999-99-99 · 💬 WhatsApp</p>
          <div className="mt-3 flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link>
            <Link to="/terms" className="hover:text-white transition">Пользовательское соглашение</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
