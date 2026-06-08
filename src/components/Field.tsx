interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

// Текстовое поле формы с подписью и сообщением об ошибке.
// Объявлено на верхнем уровне (не внутри родителя), чтобы input не терял фокус
// при перерисовке родительского компонента.
export default function Field({
  label, name, type = 'text', placeholder, autoComplete,
  required = false, value, error, onChange,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && ' *'}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
