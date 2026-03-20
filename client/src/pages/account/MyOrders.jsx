import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, ORDER_STATUS } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderService.getMine().then(setOrders).finally(()=>setLoading(false)); }, []);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Mes commandes</h2>
      {loading ? <div className="flex justify-center py-10"><Spinner /></div>
       : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">Aucune commande</p>
          <Link to="/shop" className="btn btn-primary">Faire mes premiers achats</Link>
        </div>
       ) : (
        <div className="space-y-3">
          {orders.map(o => {
            const st = ORDER_STATUS[o.status] || {};
            return (
              <Link key={o.id} to={`/account/orders/${o.id}`}
                className="card p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow block">
                <div className="min-w-0">
                  <p className="font-mono-pc text-[#2563EB] font-bold text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(o.createdAt)} · {o.items?.length} article(s)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold font-mono-pc text-slate-900 dark:text-white">{formatPrice(o.total)}</p>
                  <span className={`badge badge-${st.color||'gray'} mt-1`}>{st.label||o.status}</span>
                </div>
              </Link>
            );
          })}
        </div>
       )}
    </div>
  );
}
