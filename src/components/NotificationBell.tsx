import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import type { Notification } from '../types';

const POLL_INTERVAL_MS = 30_000;

function formatTime(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Опрашиваем количество непрочитанных уведомлений для бейджа
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchCount = () => {
      notificationsApi.unreadCount()
        .then(({ data }) => setUnreadCount(data.count))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Закрываем меню по клику снаружи
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      notificationsApi.list()
        .then(({ data }) => setNotifications(data))
        .finally(() => setLoading(false));
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      try {
        await notificationsApi.markAsRead(notification.id);
        setNotifications(prev => prev.map(n =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch {
        // отметка не удалась — всё равно открываем уведомление
      }
    }
    setOpen(false);
    if (notification.url) {
      navigate(notification.url);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // игнорируем — пользователь может повторить попытку
    }
  };

  if (!isAuthenticated) return null;

  const hasUnread = notifications.some(n => !n.read_at);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={toggleOpen}
        aria-label="Уведомления"
        className="relative p-2 rounded-lg hover:bg-white/10 transition"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold">Уведомления</p>
            {hasUnread && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-blue-700 hover:underline">
                Прочитать все
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <Spinner size="sm" className="py-8" />}

            {!loading && notifications.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Уведомлений пока нет</p>
            )}

            {!loading && notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition ${
                  !notification.read_at ? 'bg-blue-50/60' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notification.read_at && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                  <div className="min-w-0">
                    {notification.title && (
                      <p className="font-medium text-sm text-gray-800 truncate">{notification.title}</p>
                    )}
                    {notification.body && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.body}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatTime(notification.created_at)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
