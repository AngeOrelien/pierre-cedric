import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext';
import Logo         from '../../components/common/Logo';
import DarkModeToggle from '../../components/common/DarkModeToggle';
import { Toaster }  from 'react-hot-toast';

const HomeIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CubeIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const BagIcon     = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const UsersIcon   = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const BoxIcon     = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const TagIcon     = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const MenuIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const XIcon       = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const LogOutIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const GlobeIcon   = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

const NAV_SECTIONS = [
  { label:'Principal', links:[
    { to:'/admin',           end:true,  Icon:HomeIcon,  label:'Tableau de bord' },
    { to:'/admin/products',  end:false, Icon:CubeIcon,  label:'Produits'        },
    { to:'/admin/orders',    end:false, Icon:BagIcon,   label:'Commandes'       },
    { to:'/admin/customers', end:false, Icon:UsersIcon, label:'Clients'         },
  ]},
  { label:'Catalogue', links:[
    { to:'/admin/inventory',  end:false, Icon:BoxIcon, label:'Inventaire' },
    { to:'/admin/categories', end:false, Icon:TagIcon, label:'Catégories' },
  ]},
];

function SidebarLink({ to, end, Icon, label, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick}
      className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-[#0D1B36]">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <Link to="/" className="block">
          <Logo size="sm" white />
        </Link>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <XIcon className="w-4.5 h-4.5 text-white" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-2">{section.label}</p>
            <div className="space-y-0.5">
              {section.links.map(l => <SidebarLink key={l.to} {...l} onClick={onClose} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link to="/" className="admin-link text-xs">
          <GlobeIcon className="w-4 h-4" /> Voir le site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white">
            <LogOutIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0A1020]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-60 flex-shrink-0">
        <div className="w-full"><Sidebar /></div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full animate-[slideInRight_0.25s_ease-out]">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6
                            bg-white dark:bg-[#0F172A]
                            border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden">
              <MenuIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <span className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">
              Administration — Pierre-Cédric
            </span>
          </div>
          <DarkModeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { fontFamily:'Outfit, system-ui', fontSize:'0.875rem', borderRadius:'12px', padding:'12px 16px' }
      }} />
    </div>
  );
}
