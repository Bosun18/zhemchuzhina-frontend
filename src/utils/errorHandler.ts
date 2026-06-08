// Глобальный перехватчик необработанных ошибок и промисов.
// В dev — выводит в консоль, в prod — готово для подключения Sentry.

export function initGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    console.error('[GlobalError]', event.error ?? event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Игнорируем отменённые axios-запросы
    if (event.reason?.code === 'ERR_CANCELED') return;
    console.error('[UnhandledPromise]', event.reason);
  });
}
