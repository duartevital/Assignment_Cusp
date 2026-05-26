import type { SelectHTMLAttributes } from 'react';

type Props = SelectHTMLAttributes<HTMLSelectElement>;

const selectClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export default function Select({ className = '', children, ...props }: Props) {
  return (
    <select className={`${selectClass} ${className}`} {...props}>
      {children}
    </select>
  );
}
