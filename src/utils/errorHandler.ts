// Глобальный перехватчик необработанных ошибок и промисов.
// В dev — выводит в консоль, в prod — дополнительно отправляет на бэкенд (/log-error).

import { apiClient } from '../api/client';

async function sendToBackend(type: string, message: string, stack?: string) {
  try {
    await apiClient.post('/log-error', {
      type,
      message: message.slice(0, 1000),
      stack: stack?.slice(0, 5000),
      url: window.location.href,
    });
  } catch {
    // молчим — не ломаем страницу из-за ошибки в логгере
  }
}

export function initGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    const message = event.error?.message ?? event.message ?? 'Unknown error';
    const stack = event.error?.stack;
    console.error('[GlobalError]', message);
    if (import.meta.env.PROD) {
      sendToBackend('error', message, stack);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Игнорируем отменённые axios-запросы
    if (event.reason?.code === 'ERR_CANCELED') return;
    const message = event.reason?.message ?? String(event.reason) ?? 'Unhandled rejection';
    const stack = event.reason?.stack;
    console.error('[UnhandledPromise]', message);
    if (import.meta.env.PROD) {
      sendToBackend('unhandled_rejection', message, stack);
    }
  });
}
