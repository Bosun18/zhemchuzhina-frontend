const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

interface SpinnerProps {
  size?: keyof typeof sizeMap;
  // Классы для центрирующей обёртки (обычно вертикальные отступы).
  className?: string;
}

export default function Spinner({ size = 'lg', className = 'py-24' }: SpinnerProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`${sizeMap[size]} border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin`} />
    </div>
  );
}
