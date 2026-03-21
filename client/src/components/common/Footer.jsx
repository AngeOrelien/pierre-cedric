import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0D1B36] text-white">
      {/* ── Bande promo ── */}
      <div className="bg-[#2563EB] py-3">
        <div className="pc-container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="font-semibold">🎉 Livraison offerte dès 100 000 FCFA d'achat !</span>
          <Link to="/shop" className="btn btn-white btn-sm rounded-full">
            Voir la boutique →
          </Link>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="pc-container py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <Logo size="md" white />
          <p className="text-slate-400 text-sm leading-relaxed">
            Votre boutique de référence pour l'informatique et la téléphonie au Cameroun.
            Produits 100% authentiques, service après-vente garanti.
          </p>
          {/* Réseaux sociaux */}
          <div className="flex gap-3 pt-1">
            {[
              { label:'Facebook',  href:'#', svg:'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              { label:'Instagram', href:'#', svg:'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M22 16c0 6-3.582 6-8 6S6 22 6 16V8C6 2 9.582 2 14 2s8 0 8 6z' },
              { label:'LinkedIn',  href:'#', svg:'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
            ].map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#2563EB] transition-colors
                           flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d={s.svg}/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Navigation</h4>
          <ul className="space-y-2.5">
            {[
              ['/','Accueil'],
              ['/shop','Boutique'],
              ['/shop?featured=true','Promotions'],
              ['/contact','Contact'],
              ['/login','Connexion'],
              ['/register','S\'inscrire'],
            ].map(([to,l]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#2563EB]">›</span> {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Catégories */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Catégories</h4>
          <ul className="space-y-2.5">
            {[
              ['📱','Smartphones'],
              ['💻','Laptops & PC'],
              ['🎧','Accessoires'],
              ['📟','Tablettes'],
              ['🔊','Audio'],
              ['🎮','Gaming'],
            ].map(([icon,cat]) => (
              <li key={cat}>
                <Link to={`/shop?search=${cat}`} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>{icon}</span> {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Horaires */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Contact</h4>
          <ul className="space-y-4">
            {[
              { icon:'📍', lines:['Centre Commercial Mvog-Ada','Yaoundé, Cameroun'] },
              { icon:'📞', lines:['<a href="tel:+237655000000" class="hover:text-white transition-colors">+237 655 000 000</a>'] },
              { icon:'✉️', lines:['<a href="mailto:contact@pierre-cedric.cm" class="hover:text-white transition-colors">contact@pierre-cedric.cm</a>'] },
              { icon:'🕐', lines:['Lun – Sam : 8h00 – 19h00','Dim : 10h00 – 16h00'] },
            ].map((c,i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-base">{c.icon}</span>
                <div>
                  {c.lines.map((l,j) => (
                    <p key={j} className="text-sm text-slate-400"
                       dangerouslySetInnerHTML={{ __html: l }} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="pc-container py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {year} Pierre-Cédric Computer & Phone Solution. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            {['Confidentialité','CGV','Remboursements','Livraison'].map(l => (
              <Link key={l} to="#" className="hover:text-slate-300 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}