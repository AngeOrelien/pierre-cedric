import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart }      from '../context/CartContext';
import { useAuth }      from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice }  from '../utils/formatters';
import Alert   from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import toast   from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value:'cash_on_delivery',  label:'Paiement à la livraison', icon:'💵', desc:'Payez en espèces à la réception' },
  { value:'mobile_money',      label:'Mobile Money',            icon:'📱', desc:'Orange Money / MTN MoMo' },
  { value:'bank_transfer',     label:'Virement bancaire',       icon:'🏦', desc:'Coordonnées envoyées par email' },
];

const CheckIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

function StepIndicator({ step, current }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
      done   ? 'bg-green-500 text-white'
      : active ? 'bg-[#2563EB] text-white ring-4 ring-blue-200 dark:ring-blue-900/50'
      :          'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
    }`}>
      {done ? <CheckIcon className="w-4 h-4" /> : step}
    </div>
  );
}

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({
    recipientName: `${user?.firstName||''} ${user?.lastName||''}`.trim(),
    phone: user?.phone || '',
    street: '', city: 'Yaoundé', country: 'Cameroun',
    paymentMethod: 'cash_on_delivery', couponCode: '', notes: '',
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const items = cart?.items || [];

  const goStep2 = () => {
    if (!form.street.trim() || !form.city.trim()) { setError('Veuillez remplir votre adresse complète.'); return; }
    setError(''); setStep(2);
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const { order } = await orderService.create({
        shippingAddress: { recipientName:form.recipientName, phone:form.phone, street:form.street, city:form.city, country:form.country },
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode || undefined,
        notes: form.notes || undefined,
      });
      await clearCart();
      toast.success('Commande confirmée ! 🎉');
      navigate(`/order/confirmation/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0A1020] min-h-screen py-8">
      <div className="pc-container max-w-5xl">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Finaliser ma commande
        </h1>

        {/* Étapes */}
        <div className="flex items-center gap-3 mb-8">
          {[1,2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <StepIndicator step={s} current={step} />
              <span className={`text-sm font-semibold hidden sm:block ${step===s?'text-slate-900 dark:text-white':'text-slate-400'}`}>
                {s===1?'Livraison':'Confirmation'}
              </span>
              {s < 2 && <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700 ml-2" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="card p-6 space-y-5 animate-[fadeIn_0.2s]">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Adresse de livraison</h2>
                {error && <Alert type="error" message={error} />}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nom du destinataire</label>
                    <input className="input" value={form.recipientName} onChange={e=>set('recipientName',e.target.value)} placeholder="Prénom Nom" />
                  </div>
                  <div>
                    <label className="label">Téléphone</label>
                    <input className="input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+237 6XX XXX XXX" />
                  </div>
                </div>

                <div>
                  <label className="label">Adresse *</label>
                  <input required className="input" value={form.street} onChange={e=>set('street',e.target.value)}
                    placeholder="Quartier, Rue, Numéro…" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Ville *</label>
                    <select className="input" value={form.city} onChange={e=>set('city',e.target.value)}>
                      {['Yaoundé','Douala','Bafoussam','Garoua','Maroua','Ngaoundéré','Autre'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Pays</label>
                    <input className="input" value={form.country} onChange={e=>set('country',e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="label">Mode de paiement *</label>
                  <div className="space-y-2.5">
                    {PAYMENT_METHODS.map(pm => (
                      <label key={pm.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${form.paymentMethod===pm.value
                            ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <input type="radio" name="payment" value={pm.value}
                          checked={form.paymentMethod===pm.value}
                          onChange={() => set('paymentMethod',pm.value)} className="hidden" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{pm.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{pm.desc}</p>
                        </div>
                        {form.paymentMethod===pm.value && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Code promo */}
                <div>
                  <label className="label">Code promo <span className="text-slate-400 font-normal">(optionnel)</span></label>
                  <div className="flex gap-2">
                    <input className="input flex-1" value={form.couponCode} onChange={e=>set('couponCode',e.target.value.toUpperCase())}
                      placeholder="PROMO2024" />
                    <button className="btn btn-outline btn-sm flex-shrink-0">Appliquer</button>
                  </div>
                </div>

                <div>
                  <label className="label">Notes <span className="text-slate-400 font-normal">(optionnel)</span></label>
                  <textarea rows={3} className="input resize-none" value={form.notes}
                    onChange={e=>set('notes',e.target.value)}
                    placeholder="Instructions spéciales pour la livraison…" />
                </div>

                <button onClick={goStep2} className="btn btn-primary btn-lg w-full">
                  Continuer vers la confirmation →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 space-y-5 animate-[fadeIn_0.2s]">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Confirmation de commande</h2>
                {error && <Alert type="error" message={error} />}

                {/* Récap livraison */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-1.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">📦 Livraison à</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{form.recipientName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{form.street}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{form.city}, {form.country}</p>
                  {form.phone && <p className="text-sm text-slate-500">{form.phone}</p>}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">💳 Paiement</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {PAYMENT_METHODS.find(p=>p.value===form.paymentMethod)?.icon}{' '}
                    {PAYMENT_METHODS.find(p=>p.value===form.paymentMethod)?.label}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn btn-outline flex-1">
                    ← Modifier
                  </button>
                  <button onClick={submit} disabled={loading} className="btn btn-primary flex-1 btn-lg">
                    {loading
                      ? <Spinner size="sm" className="border-white border-t-transparent" />
                      : '✓ Confirmer la commande'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Récap commande */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">
                Votre commande ({items.length})
              </h3>
              <div className="space-y-3 mb-4">
                {items.map(i => {
                  const img = i.product?.images?.[0]?.url
                    || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=70';
                  return (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1 text-slate-700 dark:text-slate-300">{i.product?.name}</p>
                        <p className="text-xs text-slate-400">×{i.quantity}</p>
                      </div>
                      <span className="text-xs font-bold font-mono-pc text-slate-900 dark:text-white">
                        {formatPrice(parseFloat(i.priceSnapshot)*i.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <hr className="divider mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Sous-total</span>
                  <span className="font-mono-pc">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Livraison</span>
                  <span className="text-green-600">À calculer</span>
                </div>
              </div>
              <hr className="divider my-4" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="font-display text-2xl font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
            <div className="card p-4 space-y-2">
              {['🔒 Paiement sécurisé','✅ Produits authentiques garantis','↩️ Retour sous 7 jours'].map(b => (
                <p key={b} className="text-xs text-slate-500 dark:text-slate-400">{b}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
