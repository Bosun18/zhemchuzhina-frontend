// Форматирование даты в русском формате: «7 июня 2026 г.»
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
