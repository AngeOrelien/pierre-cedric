import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate, ORDER_STATUS } from '../../utils/formatters';
import Spinner from '../../components/common/Spinner';
import toast   from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderService.getOne(id).then(setOrder).finally(()=>setLoading(false)); }, [id]);

  const cancel = async () => {
    try { await orderService.cancel(id); setOrder(o=>({...o,status:'cancelled'})); toast.success('Commande annulée.'); }
    catch(err) { toast.error(err.response?.data?.message || 'Impossible d\'annuler'); }
  };

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (!order)  return <div className="text-slate-500">Commande introuvable.</div>;
  const st = ORDER_STATUS[order.status] || {};

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/account/orders" className="text-sm text-[#2563EB] hover:underline font-semibold">← Retour</Link>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-2">{order.orderNumber}</h2>
          <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <span className={`badge badge-${st.color||'gray'} text-sm px-3 py-1.5`}>{st.label}</span>
          {['pending','confirmed'].includes(order.status) && (
            <button onClick={cancel} className="btn btn-danger btn-sm block mt-2 ml-auto">Annuler</button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">Articles</div>
        {order.items?.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
            <div>
              <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.productName}</p>
              <p className="text-xs text-slate-400">Réf: {item.productSku} · ×{item.quantity}</p>
            </div>
            <p className="font-bold font-mono-pc text-[#2563EB]">{formatPrice(item.totalPrice)}</p>
          </div>
        ))}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-[#2563EB] font-mono-pc">{formatPrice(order.total)}</span>
        </div>
      </div>

      {order.shipStreet && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Adresse de livraison</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{order.shipName}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{order.shipStreet}, {order.shipCity}, {order.shipCountry}</p>
          {order.shipPhone && <p className="text-sm text-slate-500">{order.shipPhone}</p>}
        </div>
      )}
    </div>
  );
}
