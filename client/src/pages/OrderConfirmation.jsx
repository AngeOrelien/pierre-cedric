import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, ORDER_STATUS } from '../utils/formatters';
import Spinner from '../components/common/Spinner';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderService.getOne(id).then(setOrder).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1020] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-[slideUp_0.4s_ease-out]">
        {/* Succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 text-4xl">
            ✅
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Commande confirmée !
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Merci pour votre achat. Numéro de commande :
          </p>
          <p className="font-mono-pc font-bold text-[#2563EB] text-lg mt-1">{order?.orderNumber}</p>
          <p className="text-sm text-slate-400 mt-1">{formatDate(order?.createdAt)}</p>
        </div>

        {/* Détails */}
        <div className="card p-6 mb-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Articles commandés</h2>
          <div className="space-y-3 mb-5">
            {order?.items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 flex-1 pr-4 line-clamp-1">
                  {item.productName} <span className="text-slate-400">×{item.quantity}</span>
                </span>
                <span className="font-semibold font-mono-pc flex-shrink-0">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          <hr className="divider mb-4" />
          <div className="flex justify-between font-bold text-base">
            <span>Total payé</span>
            <span className="text-[#2563EB] font-mono-pc">{formatPrice(order?.total)}</span>
          </div>
        </div>

        {/* Livraison info */}
        {order?.shipStreet && (
          <div className="card p-5 mb-5 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-2">📦 Livraison prévue</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{order.shipName}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{order.shipStreet}, {order.shipCity}</p>
            <p className="text-xs text-[#2563EB] font-semibold mt-2">Délai estimé : 24 à 48 heures</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/account/orders" className="btn btn-primary flex-1">Suivre ma commande</Link>
          <Link to="/shop" className="btn btn-outline flex-1">Continuer les achats</Link>
        </div>
      </div>
    </div>
  );
}
