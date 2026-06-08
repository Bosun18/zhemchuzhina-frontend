import type { ApiError } from '../types';

// Достаёт человекочитаемое сообщение об ошибке из ответа API.
export function getErrorMessage(err: unknown, fallback = 'Произошла ошибка. Попробуйте позже.'): string {
  const message = (err as { response?: { data?: ApiError } })?.response?.data?.message;
  return message ?? fallback;
}

// Преобразует Laravel-ошибки валидации { field: [msg, ...] } в плоский { field: msg }.
export function parseValidationErrors(err: unknown): Record<string, string> {
  const errors = (err as { response?: { data?: ApiError } })?.response?.data?.errors;
  if (!errors) return {};
  const mapped: Record<string, string> = {};
  for (const [key, messages] of Object.entries(errors)) {
    mapped[key] = messages[0];
  }
  return mapped;
}
