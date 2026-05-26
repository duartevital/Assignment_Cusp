interface Props {
  name: string;
  photoUrl: string | null;
  size: 'sm' | 'lg';
}

const sizes = { sm: 'w-10 h-10 text-base', lg: 'w-20 h-20 text-3xl' };

const COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
];

function colorFor(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return COLORS[code % COLORS.length];
}

export default function Avatar({ name, photoUrl, size }: Props) {
  const base = `${sizes[size]} rounded-full overflow-hidden flex-shrink-0`;

  if (photoUrl) {
    return (
      <div className={base}>
        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${base} flex items-center justify-center font-semibold ${colorFor(name)}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
