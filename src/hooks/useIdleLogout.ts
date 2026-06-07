import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

// Автоматически выходит из аккаунта, если пользователь бездействует дольше timeoutMs.
export function useIdleLogout(timeoutMs: number = THIRTY_MINUTES_MS) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const idleHandlerRef = useRef(() => {});

  idleHandlerRef.current = () => {
    logout().then(() => navigate('/login'));
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => idleHandlerRef.current(), timeoutMs);
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, timeoutMs]);
}
