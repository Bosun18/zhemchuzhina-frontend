// Яндекс Метрика — подключить после деплоя на продакшн.
// Заменить XXXXXXXX на номер счётчика из metrica.yandex.ru (в двух местах).

declare global {
  interface Window {
    ym: (...args: any[]) => void;
  }
}

const COUNTER_ID = 'XXXXXXXX';

export function initYandexMetrica() {
  if (typeof window.ym === 'function') return;

  window.ym = function (...args: any[]) {
    (window.ym as any).a = (window.ym as any).a || [];
    (window.ym as any).a.push(args);
  };
  (window.ym as any).l = Date.now();

  const script = document.createElement('script');
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  script.async = true;
  script.onload = () => {
    window.ym(COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  };
  document.head.appendChild(script);
}

export function ymGoal(goalName: string, params?: object) {
  if (typeof window.ym === 'function') {
    window.ym(COUNTER_ID, 'reachGoal', goalName, params);
  }
}
