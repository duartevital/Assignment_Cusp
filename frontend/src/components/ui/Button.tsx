import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const base = 'text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 cursor-pointer';

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'border border-slate-300 text-slate-600 hover:bg-slate-50',
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
