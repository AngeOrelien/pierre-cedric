import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDateShort, ORDER_STATUS } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';

export default function AccountDashboard() {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderService.getMine().then(o => setOrders(o.slice(0,5))).finally(()=>setLoading(false)); }, []);

  const totalSpent = orders.filter(o=>!['cancelled','refunded'].includes(o.status)).reduce((s,o)=>s+parseFloat(o.total),0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative card overflow-hidden bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] text-white p-6">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h1 className="font-display text-2xl font-bold">Bonjour, {user?.firstName} 👋</h1>
        <p className="text-[#93C5FD] text-sm mt-1">Bienvenue dans votre espace personnel</p>
        <div className="flex gap-6 mt-5">
          {[
            { label:'Commandes', value:orders.length },
            { label:'Total dépensé', value:formatPrice(totalSpent) },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-[#93C5FD] text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-display font-bold text-slate-900 dark:text-white">Dernières commandes</h2>
          <Link to="/account/orders" className="text-sm text-[#2563EB] font-semibold hover:underline">Tout voir →</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : orders.length === 0 ? (
          <div className="text-center p-10">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune commande pour l'instant</p>
            <Link to="/shop" className="btn btn-primary btn-sm mt-4">Faire mes premiers achats</Link>
          </div>
        ) : (
          <table className="pc-table">
            <thead><tr><th>N° Commande</th><th>Date</th><th>Total</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {orders.map(o => {
                const st = ORDER_STATUS[o.status] || {};
                return (
                  <tr key={o.id}>
                    <td><span className="font-mono-pc text-xs text-[#2563EB]">{o.orderNumber}</span></td>
                    <td className="text-xs text-slate-400">{formatDateShort(o.createdAt)}</td>
                    <td className="font-semibold font-mono-pc text-sm">{formatPrice(o.total)}</td>
                    <td><span className={`badge-${st.color||'gray'} badge`}>{st.label||o.status}</span></td>
                    <td><Link to={`/account/orders/${o.id}`} className="text-xs text-[#2563EB] hover:underline font-semibold">Détails →</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Liens rapides */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon:'📦', title:'Mes commandes', desc:'Suivre mes livraisons', to:'/account/orders' },
          { icon:'👤', title:'Mon profil',    desc:'Modifier mes informations', to:'/account/profile' },
          { icon:'📍', title:'Mes adresses',  desc:'Gérer mes adresses', to:'/account/addresses' },
        ].map(c => (
          <Link key={c.title} to={c.to} className="card p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{c.title}</p>
              <p className="text-xs text-slate-400">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
