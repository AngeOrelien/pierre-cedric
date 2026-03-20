export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm:'w-4 h-4 border-2', md:'w-8 h-8 border-3', lg:'w-12 h-12 border-4' }[size];
  return (
    <div className={`${s} rounded-full border-slate-200 dark:border-slate-700 border-t-[#2563EB] animate-spin flex-shrink-0 ${className}`} />
  );
}

export function PageLoader({ text = 'Chargement…' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#2563EB] animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>
    </div>
  );
}

/* Skeleton cards */
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-9 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}
