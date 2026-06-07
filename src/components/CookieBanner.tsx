import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie_consent';
export type CookieConsent = 'all' | 'necessary' | null;

export function getCookieConsent(): CookieConsent {
  return localStorage.getItem(STORAGE_KEY) as CookieConsent;
}

export function setCookieConsent(value: 'all' | 'necessary') {
  localStorage.setItem(STORAGE_KEY, value);
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
    }
  }, []);

  const accept = (value: 'all' | 'necessary') => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          Мы используем файлы cookie для аналитики и улучшения работы сайта. Подробнее —{' '}
          <Link to="/privacy" className="text-blue-700 hover:underline">
            Политика конфиденциальности
          </Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => accept('necessary')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
          >
            Только необходимые
          </button>
          <button
            onClick={() => accept('all')}
            className="px-4 py-2 text-sm bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
