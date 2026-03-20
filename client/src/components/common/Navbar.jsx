/**
 * Navbar principale — sticky, glass, mega-menu, responsive
 * Inspirée de phonescanada.com : topbar + nav catégories + actions
 */
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/* ── Icônes inline SVG (pas de dépendance externe) ── */
const Icon = {
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Cart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  User: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ChevronDown: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>,
  Menu: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  LogOut: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Settings: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Package: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
};

/* Catégories nav avec icônes emoji et sous-menus */
const CATEGORIES = [
  { label:'Smartphones',  href:'/shop?categoryId=1', icon:'📱', sub:['iPhone','Samsung','Xiaomi','Tecno'] },
  { label:'Laptops & PC', href:'/shop?categoryId=2', icon:'💻', sub:['Dell','HP','Lenovo','Asus','MacBook'] },
  { label:'Accessoires',  href:'/shop?categoryId=3', icon:'🎧', sub:['Câbles','Coques','Chargeurs','Écouteurs'] },
  { label:'Tablettes',    href:'/shop?categoryId=4', icon:'📟', sub:['iPad','Samsung Tab','Huawei'] },
  { label:'Audio',        href:'/shop?categoryId=5', icon:'🔊', sub:['JBL','Sony','Bose','AirPods'] },
  { label:'Gaming',       href:'/shop?categoryId=6', icon:'🎮', sub:['Manettes','Casques','Souris','Claviers'] },
];

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQ,     setSearchQ]     = useState('');
  const [userOpen,    setUserOpen]    = useState(false);
  const [catHover,    setCatHover]    = useState(null);
  const userRef   = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Fermer menus au changement de route */
  useEffect(() => { setMobileOpen(false); setUserOpen(false); setSearchOpen(false); }, [location]);

  /* Clic extérieur */
  useEffect(() => {
    const fn = (e) => {
      if (!userRef.current?.contains(e.target))   setUserOpen(false);
      if (!searchRef.current?.contains(e.target))  setSearchOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`); setSearchOpen(false); setSearchQ(''); }
  };

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '';

  return (
    <>
      {/* ══ TOPBAR ══════════════════════════════════════ */}
      <div className="bg-[#1E3A5F] text-white text-xs py-2 hidden md:block">
        <div className="pc-container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Icon.Phone className="w-3.5 h-3.5" />
              <a href="tel:+237655000000" className="hover:text-amber-300 transition-colors">+237 655 000 000</a>
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/70">📦 Livraison Yaoundé & Douala — 24h</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <span className="text-white/30">|</span>
            <a href="mailto:contact@pierre-cedric.cm" className="hover:text-white transition-colors">
              contact@pierre-cedric.cm
            </a>
          </div>
        </div>
      </div>

      {/* ══ NAVBAR PRINCIPALE ═══════════════════════════ */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-white dark:bg-[#080D1A]'}`}>
        <div className="pc-container">
          <div className="flex items-center gap-3 h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 mr-2">
              <Logo size="md" />
            </Link>

            {/* Barre de recherche desktop */}
            <form onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-lg relative group">
              <div className="relative w-full">
                <Icon.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text" value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Rechercher iPhone, Samsung, HP, accessoires…"
                  className="w-full pl-10 pr-28 py-2.5 rounded-full border-2 border-slate-200
                             dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60
                             text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400
                             focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6]
                             transition-all duration-200"
                />
                <button type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-primary btn-sm rounded-full px-4">
                  Rechercher
                </button>
              </div>
            </form>

            {/* Actions droite */}
            <div className="ml-auto flex items-center gap-1">
              {/* Search mobile */}
              <button onClick={() => setSearchOpen(s => !s)}
                className="btn-ico btn-ghost lg:hidden focus-ring rounded-xl w-10 h-10 flex items-center justify-center">
                <Icon.Search className="w-5 h-5" />
              </button>

              {/* Dark mode */}
              <DarkModeToggle />

              {/* Panier */}
              <button onClick={openDrawer}
                className="btn-ico btn-ghost relative w-10 h-10 flex items-center justify-center rounded-xl focus-ring">
                <Icon.Cart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                                   bg-[#2563EB] text-white text-[10px] font-bold rounded-full
                                   flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {isAuth ? (
                <div className="relative" ref={userRef}>
                  <button onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl
                               hover:bg-slate-100 dark:hover:bg-slate-800
                               transition-colors focus-ring">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#1E3A5F] dark:bg-[#2563EB]
                                    flex items-center justify-center text-white text-xs font-bold
                                    overflow-hidden flex-shrink-0">
                      {user?.avatar
                        ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
                      {user?.firstName}
                    </span>
                    <Icon.ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56
                                    bg-white dark:bg-slate-900
                                    border border-slate-200 dark:border-slate-800
                                    rounded-2xl shadow-2xl py-2 animate-[scaleIn_0.15s_ease-out]
                                    origin-top-right">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      {/* Links */}
                      <div className="py-1">
                        {[
                          { to:'/account',        icon:Icon.User,     label:'Mon compte'   },
                          { to:'/account/orders', icon:Icon.Package,  label:'Mes commandes'},
                        ].map(l => (
                          <Link key={l.to} to={l.to}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-slate-700 dark:text-slate-300
                                       hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <l.icon className="w-4 h-4 text-slate-400" />
                            {l.label}
                          </Link>
                        ))}
                        {user?.role === 'admin' && (
                          <Link to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-[#2563EB] dark:text-blue-400
                                       hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Icon.Settings className="w-4 h-4" />
                            Administration
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm
                                     text-red-600 dark:text-red-400
                                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Icon.LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link to="/login"    className="btn btn-ghost btn-sm text-slate-600 dark:text-slate-400">Connexion</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
                </div>
              )}

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(o => !o)}
                className="btn-ico btn-ghost w-10 h-10 flex items-center justify-center rounded-xl ml-1 lg:hidden focus-ring">
                {mobileOpen ? <Icon.X className="w-5 h-5" /> : <Icon.Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Catégories desktop ── */}
          <nav className="hidden lg:flex items-center gap-0 border-t border-slate-100 dark:border-slate-800/60 -mx-8 px-8">
            {CATEGORIES.map(cat => (
              <div key={cat.label} className="relative group"
                onMouseEnter={() => setCatHover(cat.label)}
                onMouseLeave={() => setCatHover(null)}>
                <NavLink to={cat.href}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors
                     border-b-2 -mb-px
                     ${isActive
                       ? 'text-[#2563EB] dark:text-blue-400 border-[#2563EB]'
                       : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#2563EB] dark:hover:text-blue-400 hover:border-blue-200'}`
                  }>
                  <span>{cat.icon}</span>
                  {cat.label}
                  <Icon.ChevronDown className="w-3 h-3 opacity-50" />
                </NavLink>

                {/* Sous-menu dropdown */}
                {catHover === cat.label && (
                  <div className="absolute top-full left-0 mt-0 pt-1 z-50">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                                    rounded-xl shadow-xl py-2 min-w-[160px] animate-[fadeIn_0.15s_ease-out]">
                      {cat.sub.map(s => (
                        <Link key={s} to={`/shop?search=${s}`}
                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400
                                     hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#2563EB] transition-colors">
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Promotions */}
            <NavLink to="/shop?featured=true"
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-[#F59E0B]
                         border-b-2 border-transparent hover:border-amber-300 -mb-px transition-colors ml-auto">
              🔥 Promotions
            </NavLink>
          </nav>
        </div>

        {/* ── Search mobile dropdown ── */}
        {searchOpen && (
          <div ref={searchRef} className="lg:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-3 animate-[slideUp_0.2s_ease-out]">
            <form onSubmit={handleSearch} className="relative">
              <Icon.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                autoFocus value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Rechercher un produit…"
                className="input pl-10"
              />
            </form>
          </div>
        )}
      </header>

      {/* ══ MENU MOBILE ═════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
               onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw]
                          bg-white dark:bg-[#0F172A] shadow-2xl flex flex-col
                          animate-[slideInRight_0.25s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <Logo size="md" />
              <button onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg
                           hover:bg-slate-100 dark:hover:bg-slate-800">
                <Icon.X className="w-5 h-5" />
              </button>
            </div>

            {/* Catégories */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Catégories</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <Link key={cat.label} to={cat.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                               text-slate-700 dark:text-slate-300
                               hover:bg-[#2563EB]/10 hover:text-[#2563EB] transition-colors">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-sm">{cat.label}</span>
                  </Link>
                ))}
              </div>

              {/* Auth mobile */}
              {!isAuth && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link to="/login"    className="btn btn-outline w-full">Connexion</Link>
                  <Link to="/register" className="btn btn-primary w-full">S'inscrire gratuitement</Link>
                </div>
              )}

              {isAuth && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <Link to="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Icon.User className="w-4 h-4" /> Mon compte
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Icon.Package className="w-4 h-4" /> Mes commandes
                  </Link>
                  <button onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Icon.LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Footer contact */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                📞 <a href="tel:+237655000000" className="hover:text-[#2563EB]">+237 655 000 000</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
