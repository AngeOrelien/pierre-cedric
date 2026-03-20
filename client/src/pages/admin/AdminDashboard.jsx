import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDateShort, ORDER_STATUS } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';

const UP = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const WARN = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const KPI = ({ icon, label, value, sub, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminService.getStats().then(setData).finally(()=>setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  const { stats = {}, recentOrders = [], topProducts = [] } = data || {};

  return (
    <div className="space-y-8 animate-[fadeIn_0.2s]">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Alerte stock faible */}
      {stats.lowStockProducts > 0 && (
        <Link to="/admin/inventory"
          className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20
                     border border-amber-200 dark:border-amber-800 rounded-2xl
                     text-amber-700 dark:text-amber-400 hover:shadow-md transition-shadow">
          <WARN className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">
            {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''} en stock faible — Voir l'inventaire →
          </span>
        </Link>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPI icon="👥" label="Clients" value={stats.totalCustomers||0} color="bg-blue-100 dark:bg-blue-900/30" />
        <KPI icon="📦" label="Produits actifs" value={stats.totalProducts||0} color="bg-purple-100 dark:bg-purple-900/30" />
        <KPI icon="🛒" label="Commandes" value={stats.totalOrders||0} sub={`${stats.pendingOrders||0} en attente`} color="bg-green-100 dark:bg-green-900/30" />
        <KPI icon="💰" label="Chiffre d'affaires" value={formatPrice(stats.revenue||0)} color="bg-amber-100 dark:bg-amber-900/30" />
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Commandes récentes */}
        <div className="xl:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display font-bold text-slate-900 dark:text-white">Commandes récentes</h2>
            <Link to="/admin/orders" className="text-sm text-[#2563EB] font-semibold hover:underline">Voir tout →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Aucune commande pour l'instant</p>
          ) : (
            <table className="pc-table">
              <thead><tr><th>N°</th><th>Client</th><th>Montant</th><th>Statut</th><th>Date</th></tr></thead>
              <tbody>
                {recentOrders.map(o => {
                  const st = ORDER_STATUS[o.status] || {};
                  return (
                    <tr key={o.id}>
                      <td><span className="font-mono-pc text-xs text-[#2563EB]">{o.orderNumber}</span></td>
                      <td>
                        <p className="text-sm font-medium">{o.user?.firstName} {o.user?.lastName}</p>
                        <p className="text-xs text-slate-400">{o.user?.email}</p>
                      </td>
                      <td className="font-semibold font-mono-pc text-sm">{formatPrice(o.total)}</td>
                      <td><span className={`badge badge-${st.color||'gray'}`}>{st.label||o.status}</span></td>
                      <td className="text-xs text-slate-400">{formatDateShort(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Top ventes */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display font-bold text-slate-900 dark:text-white">Top ventes</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {topProducts.map((p, i) => {
              const img = p.images?.[0]?.url
                || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=70';
              return (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <span className="text-sm font-bold text-slate-300 dark:text-slate-600 w-5 text-center flex-shrink-0">
                    {i+1}
                  </span>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 text-slate-800 dark:text-slate-200">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.soldCount} vendus · Stock: {p.stock}</p>
                  </div>
                  <p className="text-sm font-bold text-[#2563EB] font-mono-pc flex-shrink-0">{formatPrice(p.price)}</p>
                </div>
              );
            })}
            {topProducts.length === 0 && (
              <p className="p-6 text-sm text-slate-400">Aucune vente pour l'instant</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
