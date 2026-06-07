# Жемчужина — Фронтенд

Сайт гостевого дома «Жемчужина», Пицунда, Абхазия.  
Фронтенд написан на React + TypeScript, взаимодействует с Laravel API.

## Технологии

- **React 19** — UI-библиотека
- **TypeScript** — статическая типизация
- **Vite** — сборщик и dev-сервер
- **Tailwind CSS v4** — утилитарные CSS-стили
- **React Router v7** — клиентская маршрутизация
- **Axios** — HTTP-клиент для работы с API

## Структура проекта

```
src/
├── api/           # Axios-клиент и функции запросов к API
├── components/    # Переиспользуемые компоненты (CookieBanner и др.)
├── context/       # React Context (AuthContext — авторизация)
├── hooks/         # Кастомные хуки
├── layouts/       # Layouts (MainLayout с шапкой и футером)
├── pages/         # Страницы приложения
├── types/         # TypeScript-типы
└── utils/         # Утилиты (metrica.ts — Яндекс Метрика)
```

## Страницы

| Путь | Страница |
|------|----------|
| `/` | Главная |
| `/rooms` | Номера |
| `/booking` | Бронирование |
| `/services` | Услуги и акции |
| `/news` | Новости |
| `/news/:id` | Статья новости |
| `/gallery` | Галерея |
| `/reviews` | Отзывы |
| `/contacts` | Контакты |
| `/login` | Вход |
| `/register` | Регистрация |
| `/account` | Личный кабинет |
| `/privacy` | Политика конфиденциальности |
| `/terms` | Пользовательское соглашение |

## Установка и запуск

### Требования

- Node.js 18+
- npm или pnpm

### Локальный запуск

```bash
# Установить зависимости
npm install

# Создать файл переменных окружения
cp .env.example .env.local

# Запустить dev-сервер
npm run dev
```

Сайт будет доступен по адресу: http://localhost:5173

### Переменные окружения

Создай файл `.env.local` в корне проекта:

```
VITE_API_URL=http://localhost:8000/api
```

В продакшне укажи реальный адрес API:

```
VITE_API_URL=https://your-domain.ru/api
```

## Сборка для продакшна

```bash
npm run build
```

Собранные файлы появятся в папке `dist/` — их нужно разместить на сервере.

## Связанные репозитории

- **Бэкенд**: [Bosun18/zhemchuzhina-backend](https://github.com/Bosun18/zhemchuzhina-backend)  
  Laravel 13 + Filament 5 + MySQL
