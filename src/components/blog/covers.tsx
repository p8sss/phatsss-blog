import {cn} from '@/lib/utils';

const GRADIENTS = [
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-cyan-400 via-sky-500 to-blue-600',
  'from-purple-500 via-fuchsia-500 to-pink-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-sky-400 via-blue-500 to-indigo-600',
];

export function coverGradient(permalink: string): string {
  let hash = 0;
  for (let i = 0; i < permalink.length; i++) {
    hash = (hash * 31 + permalink.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function CoverArt({
  permalink,
  className,
  children,
}: {
  permalink: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        coverGradient(permalink),
        className,
      )}>
      <div className="absolute -top-12 -left-12 size-36 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute -right-10 -bottom-14 size-44 rounded-full bg-black/20 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.35),transparent_52%)]" />
      {children}
    </div>
  );
}
