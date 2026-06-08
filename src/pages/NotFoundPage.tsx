import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🌊</div>
        <h1 className="text-3xl font-bold text-blue-900 mb-3">Страница не найдена</h1>
        <p className="text-gray-500 mb-8">
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
