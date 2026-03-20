import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BagIcon     = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const MapPinIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const HomeIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

const links = [
  { to:'/account',           end:true,  Icon:HomeIcon,   label:'Tableau de bord' },
  { to:'/account/orders',    end:false, Icon:BagIcon,    label:'Mes commandes'   },
  { to:'/account/profile',   end:false, Icon:UserIcon,   label:'Mon profil'      },
  { to:'/account/addresses', end:false, Icon:MapPinIcon, label:'Mes adresses'    },
];

export default function AccountLayout() {
  const { user } = useAuth();
  return (
    <div className="bg-slate-50 dark:bg-[#0A1020] min-h-screen py-8">
      <div className="pc-container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="card p-5">
              {/* Avatar + nom */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]
                                flex items-center justify-center text-white font-bold text-base overflow-hidden flex-shrink-0">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    : `${user?.firstName?.[0]}${user?.lastName?.[0]}`}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} end={l.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                       ${isActive
                         ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30'
                         : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`
                    }>
                    <l.Icon className="w-4 h-4 flex-shrink-0" />
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 animate-[fadeIn_0.2s]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
