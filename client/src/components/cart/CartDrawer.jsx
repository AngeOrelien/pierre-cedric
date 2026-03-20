import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import Spinner from '../common/Spinner';

const XIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const BagIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const TrashIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, updateItem, removeItem, subtotal, loading } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];

  return (
    <>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
               onClick={closeDrawer} />

          {/* Drawer */}
          <div className="relative w-full max-w-[400px] bg-white dark:bg-[#0F172A]
                          h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4
                             border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                  <BagIcon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 dark:text-white text-base">Mon Panier</h2>
                  {items.length > 0 && (
                    <p className="text-xs text-slate-500">{items.reduce((s,i)=>s+i.quantity,0)} article(s)</p>
                  )}
                </div>
              </div>
              <button onClick={closeDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <XIcon className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-10"><Spinner size="lg" /></div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4">
                    🛒
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Votre panier est vide</p>
                  <p className="text-sm text-slate-400 mt-1">Ajoutez des produits depuis la boutique</p>
                  <Link to="/shop" onClick={closeDrawer} className="btn btn-primary btn-sm mt-5 rounded-full">
                    Découvrir la boutique
                  </Link>
                </div>
              ) : (
                items.map(item => {
                  /* REMPLACER_IMAGE : l'URL de l'image produit */
                  const img = item.product?.images?.[0]?.url
                    || 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=200&q=80';
                  return (
                    <div key={item.id}
                      className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800
                                 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                      {/* Image */}
                      <Link to={`/product/${item.product?.slug}`} onClick={closeDrawer}
                        className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img src={img} alt={item.product?.name} className="w-full h-full object-cover" />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product?.slug}`} onClick={closeDrawer}>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200
                                        line-clamp-2 leading-snug hover:text-[#2563EB] transition-colors">
                            {item.product?.name}
                          </p>
                        </Link>
                        <p className="text-sm font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc mt-1">
                          {formatPrice(item.priceSnapshot)}
                        </p>

                        {/* Qty */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <button
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500
                                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-lg leading-none">
                              −
                            </button>
                            <span className="px-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border-x border-slate-200 dark:border-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product?.stock}
                              className="w-7 h-7 flex items-center justify-center text-slate-500
                                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-lg leading-none disabled:opacity-30">
                              +
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                       text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Sous-total</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-white font-mono-pc">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Livraison calculée à l'étape suivante
                </p>
                <button onClick={() => { closeDrawer(); navigate('/checkout'); }}
                  className="btn btn-primary btn-lg w-full">
                  Commander →
                </button>
                <Link to="/cart" onClick={closeDrawer}
                  className="btn btn-outline w-full">
                  Voir le panier complet
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
