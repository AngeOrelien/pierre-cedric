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

import logo from '../../assets/images/logo/logo-full.png';

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
      <div className={`${s.wrap} aspect-square flex-shrink-0 flex items-center justify-center`}>
        <img 
          src={logo}
          alt="Logo"
          className="h-full w-full object-contain"
        />
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
