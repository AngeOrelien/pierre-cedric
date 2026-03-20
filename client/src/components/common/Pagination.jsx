export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  const range = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 2) range.push(i);
    else if (range[range.length - 1] !== '…') range.push('…');
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-9 h-9 rounded-lg btn-ghost flex items-center justify-center disabled:opacity-30 text-lg">
        ‹
      </button>
      {range.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
              ${p === page
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'btn-ghost text-slate-600 dark:text-slate-400'}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
        className="w-9 h-9 rounded-lg btn-ghost flex items-center justify-center disabled:opacity-30 text-lg">
        ›
      </button>
    </div>
  );
}
