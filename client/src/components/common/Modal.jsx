import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, size = 'md', noPad = false }) {
  const Icon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm:'max-w-sm', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl', full:'max-w-6xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s]"
           onClick={onClose} />
      {/* Dialog */}
      <div className={`relative w-full ${sizes[size]}
                       bg-white dark:bg-[#0F172A]
                       rounded-t-3xl sm:rounded-2xl shadow-2xl
                       animate-[slideUp_0.25s_ease-out]
                       max-h-[95vh] flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Icon className="w-4.5 h-4.5" />
          </button>
        </div>
        {/* Body */}
        <div className={`overflow-y-auto flex-1 ${noPad ? '' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
