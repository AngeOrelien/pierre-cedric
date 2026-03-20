import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import Spinner from '../components/common/Spinner';

const TrashIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const BagIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const ArrowRight = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, subtotal, loading } = useCart();
  const { isAuth } = useAuth();
  const navigate   = useNavigate();
  const items = cart?.items || [];

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  if (!isAuth) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#080D1A]">
      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl mb-5">🔐</div>
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Connexion requise</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Connectez-vous pour voir et gérer votre panier</p>
      <Link to="/login" className="btn btn-primary btn-lg">Se connecter →</Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#080D1A]">
      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl mb-5">🛒</div>
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Votre panier est vide</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Ajoutez des produits depuis notre boutique</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Découvrir la boutique</Link>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-[#0A1020] min-h-screen py-8">
      <div className="pc-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Mon Panier</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{items.reduce((s,i)=>s+i.quantity,0)} article(s)</p>
          </div>
          <button onClick={clearCart}
            className="btn btn-ghost text-sm text-slate-400 hover:text-red-500 flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            Vider le panier
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              /* REMPLACER_IMAGE */
              const img = item.product?.images?.[0]?.url
                || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80';
              return (
                <div key={item.id} className="card p-4 flex gap-4 items-start">
                  <Link to={`/product/${item.product?.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0
                               bg-slate-100 dark:bg-slate-800">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product?.slug}`}>
                      <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200
                                      hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                        {item.product?.name}
                      </h3>
                    </Link>
                    {item.product?.brand && (
                      <p className="text-xs text-slate-400 mt-1">{item.product.brand?.name}</p>
                    )}
                    <p className="font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc text-sm mt-1.5">
                      {formatPrice(item.priceSnapshot)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button onClick={() => updateItem(item.id, item.quantity-1)}
                          className="w-9 h-9 flex items-center justify-center text-xl text-slate-500
                                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          −
                        </button>
                        <span className="px-4 font-bold text-sm text-slate-900 dark:text-white border-x-2 border-slate-200 dark:border-slate-700">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateItem(item.id, item.quantity+1)}
                          disabled={item.quantity >= item.product?.stock}
                          className="w-9 h-9 flex items-center justify-center text-xl text-slate-500
                                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30">
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white font-mono-pc text-sm">
                          {formatPrice(parseFloat(item.priceSnapshot) * item.quantity)}
                        </span>
                        <button onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center
                                     text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link to="/shop" className="flex items-center gap-2 text-sm text-[#2563EB] font-semibold hover:gap-3 transition-all pt-2">
              ← Continuer les achats
            </Link>
          </div>

          {/* Récapitulatif */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h2 className="font-display font-bold text-slate-900 dark:text-white">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span className="line-clamp-1 flex-1 pr-2 text-xs">{i.product?.name} ×{i.quantity}</span>
                    <span className="flex-shrink-0 font-mono-pc">{formatPrice(parseFloat(i.priceSnapshot)*i.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Livraison</span>
                <span className="text-green-600 font-semibold">Calculée à l'étape suivante</span>
              </div>
              <hr className="divider" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="font-display text-2xl font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg w-full">
                Procéder au paiement <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Badges réassurance */}
            <div className="card p-4 space-y-2.5">
              {[
                { icon:'🔒', text:'Paiement 100% sécurisé' },
                { icon:'✅', text:'Produits authentiques garantis' },
                { icon:'↩️', text:'Retour possible sous 7 jours' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
