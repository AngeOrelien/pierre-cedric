const VARIANTS = {
  success: { bg:'bg-green-50 dark:bg-green-900/20',  border:'border-green-400', text:'text-green-800 dark:text-green-300', icon:'✅' },
  error  : { bg:'bg-red-50 dark:bg-red-900/20',    border:'border-red-400',   text:'text-red-800 dark:text-red-300',   icon:'❌' },
  warning: { bg:'bg-amber-50 dark:bg-amber-900/20', border:'border-amber-400', text:'text-amber-800 dark:text-amber-300',icon:'⚠️' },
  info   : { bg:'bg-blue-50 dark:bg-blue-900/20',   border:'border-blue-400',  text:'text-blue-800 dark:text-blue-300', icon:'ℹ️' },
};

export default function Alert({ type = 'info', message, className = '' }) {
  const v = VARIANTS[type] || VARIANTS.info;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${v.bg} ${v.border} animate-[fadeIn_0.2s] ${className}`}>
      <span className="text-base mt-0.5 flex-shrink-0">{v.icon}</span>
      <p className={`text-sm font-medium ${v.text}`}>{message}</p>
    </div>
  );
}
