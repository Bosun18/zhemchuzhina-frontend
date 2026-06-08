import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Админ-панель живёт на том же бэкенде, что и API — берём её адрес из общего origin,
// чтобы при смене окружения (dev/prod) не нужно было держать в синхроне два URL.
export const ADMIN_URL = `${new URL(API_URL).origin}/admin`;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Подставляем токен из localStorage в каждый запрос
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Эндпоинты авторизации: их 401/422 должны обрабатывать сами страницы
// (показать «неверный пароль» и т.п.), а не выкидывать на /login.
const AUTH_PATHS = ['/login', '/register', '/logout', '/log-error'];

// При 401 очищаем авторизацию и уводим на /login — но только если истекла
// живая сессия: был токен, это не auth-запрос и мы ещё не на /login.
// Иначе ошибка входа «проглатывалась» бы редиректом, а фоновый запрос с
// протухшим токеном мог бы выкинуть пользователя со страницы в любой момент.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';
    const isAuthPath = AUTH_PATHS.some((path) => url.includes(path));
    const hadToken = !!localStorage.getItem('token');

    if (status === 401 && hadToken && !isAuthPath && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
