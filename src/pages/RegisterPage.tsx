import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

interface FieldProps {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function Field({ label, type = 'text', required = false, value, error, onChange }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    password: '', password_confirmation: '', agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!form.agree) {
      setErrors({ agree: 'Необходимо принять условия' });
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        city: form.city,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      await login(form.email, form.password);
      navigate('/account');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const mapped: Record<string, string> = {};
        for (const [key, val] of Object.entries(err.response.data.errors)) {
          mapped[key] = (val as string[])[0];
        }
        setErrors(mapped);
      } else {
        setErrors({ general: err.response?.data?.message || 'Ошибка регистрации' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">Регистрация</h1>
        {errors.general && <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 mb-4 text-sm">{errors.general}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Имя и фамилия" required value={form.name} error={errors.name} onChange={v => set('name', v)} />
          <Field label="Email" type="email" required value={form.email} error={errors.email} onChange={v => set('email', v)} />
          <Field label="Телефон (WhatsApp)" value={form.phone} error={errors.phone} onChange={v => set('phone', v)} />
          <Field label="Город проживания" required value={form.city} error={errors.city} onChange={v => set('city', v)} />
          <Field label="Пароль" type="password" required value={form.password} error={errors.password} onChange={v => set('password', v)} />
          <Field label="Повторите пароль" type="password" required value={form.password_confirmation} error={errors.password_confirmation} onChange={v => set('password_confirmation', v)} />
          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={form.agree}
              onChange={e => set('agree', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              Принимаю{' '}
              <Link to="/terms" className="text-blue-700 hover:underline">Пользовательское соглашение</Link>
              {' '}и{' '}
              <Link to="/privacy" className="text-blue-700 hover:underline">Политику конфиденциальности</Link>
            </label>
          </div>
          {errors.agree && <p className="text-red-600 text-xs">{errors.agree}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-700 hover:underline font-medium">Войти</Link>
        </p>
      </div>
    </div>
  );
}
