// Хелперы дат. Везде работаем со строками YYYY-MM-DD —
// лексикографическое сравнение таких строк корректно.

export const pad = (v: number) => String(v).padStart(2, '0');

// month — 0-based (как в Date).
export const dateStr = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

// Прибавляет n дней к дате формата YYYY-MM-DD (без сдвигов из-за таймзоны).
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(y, m - 1, d + n);
  return dateStr(next.getFullYear(), next.getMonth(), next.getDate());
}

// Сегодняшняя дата (вычисляется один раз при загрузке модуля).
export const todayStr = (() => {
  const now = new Date();
  return dateStr(now.getFullYear(), now.getMonth(), now.getDate());
})();
