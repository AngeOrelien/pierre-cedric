/**
 * Logo Pierre-Cédric
 *
 * POUR UTILISER VOTRE PROPRE LOGO :
 * Option A — SVG/PNG importé :
 *   import logoFull  from '../../assets/images/logo/logo-full.svg'
 *   import logoWhite from '../../assets/images/logo/logo-full-white.svg'
 *   Remplacez le rendu ci-dessous par : <img src={white ? logoWhite : logoFull} ... />
 *
 * Option B — CSS background-image :
 *   .logo-img { background-image: url('../../assets/images/logo/logo-full.png') }
 *
 * Couleurs à ajuster selon votre charte graphique réelle :
 *   - Icône PC  : bg-[#2563EB] → votre couleur primaire
 *   - Accent    : bg-[#F59E0B] → votre couleur secondaire
 *   - Texte     : text-[#1E3A5F] / text-white
 */
export default function Logo({ size = 'md', white = false, className = '' }) {
  const s = {
    sm: { wrap:'h-8',   icon:'w-5 h-5', name:'text-sm',  sub:'text-[10px]' },
    md: { wrap:'h-10',  icon:'w-6 h-6', name:'text-base',sub:'text-[11px]' },
    lg: { wrap:'h-13',  icon:'w-8 h-8', name:'text-xl',  sub:'text-xs'     },
  }[size] || size;

  const nameColor = white ? 'text-white' : 'text-[#1E3A5F] dark:text-white';
  const subColor  = white ? 'text-white/70' : 'text-slate-500 dark:text-slate-400';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icône */}
      <div className={`${s.wrap} aspect-square flex-shrink-0 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-sm`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={s.icon}>
          {/* Écran moniteur */}
          <rect x="3" y="4" width="26" height="17" rx="2.5" stroke="white" strokeWidth="1.8" fill="none"/>
          <rect x="3" y="4" width="26" height="17" rx="2.5" fill="white" fillOpacity="0.08"/>
          {/* Pied */}
          <path d="M11 21v2.5c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5V21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Base */}
          <path d="M8.5 28h15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Lignes code */}
          <path d="M8 10h5M8 13.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".7"/>
          {/* Point accent ambre */}
          <circle cx="22.5" cy="11.5" r="3.5" fill="#F59E0B"/>
          <path d="M21 11.5l1.2 1.2 2-2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Texte */}
      <div className="leading-none">
        <div className={`font-display font-bold ${s.name} ${nameColor} tracking-tight`}>
          Pierre-Cédric
        </div>
        {size !== 'sm' && (
          <div className={`font-medium ${s.sub} ${subColor} mt-0.5 tracking-wide`}>
            Computer & Phone Solution
          </div>
        )}
      </div>
    </div>
  );
}
