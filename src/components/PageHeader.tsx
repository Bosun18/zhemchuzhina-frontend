import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  // Строка станет приглушённым blue-200; для особых случаев можно
  // передать готовый JSX (например, среднюю оценку на странице отзывов).
  subtitle?: ReactNode;
  // Ширина контентного контейнера — та же, что у контейнера страницы.
  maxWidth?: string;
  align?: 'center' | 'left';
  // Доп. контент справа от заголовка (например, переключатель месяцев).
  children?: ReactNode;
}

// Единая шапка контентных страниц: полоса на всю ширину с брендовым
// градиентом и декоративными кругами (без растровых изображений).
export default function PageHeader({
  title,
  subtitle,
  maxWidth = 'max-w-6xl',
  align = 'center',
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div aria-hidden className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-white/5" />
      <div aria-hidden className="absolute -bottom-28 right-40 w-56 h-56 rounded-full bg-white/5" />
      <div aria-hidden className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/5" />
      <div
        className={`relative ${maxWidth} mx-auto px-4 py-3 ${
          align === 'center' ? 'text-center' : ''
        } ${children ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4' : ''}`}
      >
        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          {subtitle && <p className="text-blue-200 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
