import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatDateShort } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';

const SearchIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService.getCustomers({ search }).then(d => { setCustomers(d.customers||[]); setTotal(d.total||0); }).finally(()=>setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s]">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Clients ({total})</h1>
      <div className="relative max-w-xs">
        <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom ou email…" className="input pl-10" />
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
          <table className="pc-table">
            <thead><tr><th>Client</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Inscription</th><th>Statut</th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                        {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full object-cover" /> : `${c.firstName?.[0]}${c.lastName?.[0]}`}
                      </div>
                      <span className="font-medium text-sm">{c.firstName} {c.lastName}</span>
                    </div>
                  </td>
                  <td className="text-sm text-slate-500">{c.email}</td>
                  <td className="text-sm text-slate-500">{c.phone||'—'}</td>
                  <td><span className={`badge ${c.role==='admin'?'badge-primary':'badge-gray'}`}>{c.role}</span></td>
                  <td className="text-xs text-slate-400">{formatDateShort(c.createdAt)}</td>
                  <td><span className={`badge ${c.isActive?'badge-success':'badge-danger'}`}>{c.isActive?'Actif':'Inactif'}</span></td>
                </tr>
              ))}
              {customers.length===0 && <tr><td colSpan={6} className="text-center py-10 text-slate-400">Aucun client</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
