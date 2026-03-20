import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart }  from '../context/CartContext';
import { useAuth }  from '../context/AuthContext';
import { formatPrice, formatDate, discountPercent, ORDER_STATUS } from '../utils/formatters';
import Spinner from '../components/common/Spinner';
import ProductGrid from '../components/product/ProductGrid';
import toast from 'react-hot-toast';

const StarFilled = () => <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>;
const StarEmpty = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-slate-300 dark:text-slate-600"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>;

function Stars({ rating, size = 'md' }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => s <= rating ? <StarFilled key={s} /> : <StarEmpty key={s} />)}
    </div>
  );
}

export default function ProductPage() {
  const { slug }    = useParams();
  const { addItem } = useCart();
  const { isAuth }  = useAuth();
  const navigate    = useNavigate();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [mainImg,  setMainImg]  = useState(null);
  const [qty,      setQty]      = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);
  const [activeTab,setActiveTab]= useState('description');

  useEffect(() => {
    setLoading(true); setQty(1);
    productService.getOne(slug)
      .then(p => {
        setProduct(p);
        setMainImg(p?.images?.[0]?.url || null);
        if (p?.categoryId) {
          productService.getAll({ categoryId: p.categoryId, limit: 4 })
            .then(r => setRelated((r.products || []).filter(x => x.id !== p.id).slice(0,4)));
        }
      })
      .catch(() => toast.error('Produit introuvable'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    if (!isAuth) { navigate('/login', { state:{ from:{ pathname:`/product/${slug}` } } }); return; }
    setAdding(true);
    try {
      await addItem(product.id, qty);
      toast.success(`${product.name} ajouté au panier !`, { icon:'🛒' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally { setAdding(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1A] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1A] flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">Produit introuvable</h2>
      <Link to="/shop" className="btn btn-primary mt-4">Retour à la boutique</Link>
    </div>
  );

  const disc      = discountPercent(product.price, product.comparePrice);
  const outOfStock = product.stock === 0;
  const lowStock   = !outOfStock && product.stock <= 5;
  const savings    = product.comparePrice > product.price
    ? (parseFloat(product.comparePrice) - parseFloat(product.price)) * qty : 0;

  /* Image principale — fallback Unsplash REMPLACER_IMAGE */
  const displayImg = mainImg
    || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80';

  const avgRating = product.reviews?.length
    ? Math.round(product.reviews.reduce((s,r)=>s+r.rating,0)/product.reviews.length)
    : 0;

  return (
    <div className="bg-white dark:bg-[#080D1A] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-slate-50 dark:bg-[#0A1020] border-b border-slate-100 dark:border-slate-800 py-3">
        <div className="pc-container">
          <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link to="/" className="hover:text-[#2563EB]">Accueil</Link>
            <span>›</span>
            <Link to="/shop" className="hover:text-[#2563EB]">Boutique</Link>
            {product.category && <>
              <span>›</span>
              <Link to={`/shop?categoryId=${product.categoryId}`} className="hover:text-[#2563EB]">
                {product.category.name}
              </Link>
            </>}
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="pc-container py-8 lg:py-12">
        {/* ── Bloc principal ── */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* ── Galerie ── */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group">
              <img src={displayImg} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'; }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew     && <span className="badge badge-navy">Nouveau</span>}
                {disc > 0          && <span className="badge badge-danger">−{disc}%</span>}
                {product.isFeatured && <span className="badge badge-accent">⭐ Vedette</span>}
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                Passez la souris pour zoomer
              </div>
            </div>

            {/* Miniatures */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map(img => (
                  <button key={img.id} onClick={() => setMainImg(img.url)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                      ${mainImg === img.url
                        ? 'border-[#2563EB] shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Informations ── */}
          <div className="space-y-5">
            {/* Brand + catégorie */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand    && <span className="badge badge-primary">{product.brand.name}</span>}
              {product.category && <span className="badge badge-gray">{product.category.name}</span>}
              {product.isNew    && <span className="badge badge-success">Nouveau</span>}
            </div>

            {/* Titre */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Rating + reviews count */}
            <div className="flex items-center gap-3">
              <Stars rating={avgRating || 4} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                ({product.reviews?.length || 0} avis)
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {product.soldCount || 0} vendus
              </span>
            </div>

            {/* Prix */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-3xl font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-base text-slate-400 line-through font-mono-pc">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {disc > 0 && (
                  <span className="badge badge-danger text-sm">Économisez {disc}%</span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  💰 Vous économisez {formatPrice(savings)} sur cette commande
                </p>
              )}
            </div>

            {/* Description courte */}
            {product.shortDesc && (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Disponibilité */}
            <div className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold
              ${outOfStock
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : lowStock
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                outOfStock ? 'bg-red-400' : lowStock ? 'bg-amber-400' : 'bg-green-400 animate-pulse'}`} />
              {outOfStock ? '⚠️ Rupture de stock' : lowStock ? `⚡ Plus que ${product.stock} en stock !` : `✅ En stock (${product.stock} disponibles)`}
            </div>

            {/* Quantité + Panier */}
            {!outOfStock && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantité :</label>
                  <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-xl text-slate-500
                                 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      −
                    </button>
                    <span className="w-14 h-10 flex items-center justify-center font-bold text-slate-900 dark:text-white border-x-2 border-slate-200 dark:border-slate-700">
                      {qty}
                    </span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-xl text-slate-500
                                 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">max {product.stock}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAdd} disabled={adding}
                    className="btn btn-primary btn-lg flex-1">
                    {adding
                      ? <Spinner size="sm" className="border-white border-t-transparent" />
                      : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                         Ajouter au panier</>
                    }
                  </button>
                  <button className="btn btn-outline w-12 h-12 p-0 flex-shrink-0 rounded-xl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                {qty > 1 && (
                  <p className="text-sm text-slate-500 text-center">
                    Total : <strong className="text-[#2563EB] font-mono-pc">{formatPrice(parseFloat(product.price) * qty)}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Garanties */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon:'🛡️', label:'Garantie 12 mois' },
                { icon:'🚚', label:'Livraison 24-48h' },
                { icon:'✅', label:'Produit authentique' },
                { icon:'↩️', label:'Retour sous 7 jours' },
              ].map(g => (
                <div key={g.label} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{g.icon}</span> {g.label}
                </div>
              ))}
            </div>

            {/* Partage */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">Partager :</span>
              {['WhatsApp','Facebook','Copier le lien'].map(s => (
                <button key={s} className="text-xs text-[#2563EB] hover:underline">{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Onglets ── */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
            {[
              { id:'description', label:'Description' },
              { id:'specs',       label:'Caractéristiques' },
              { id:'reviews',     label:`Avis (${product.reviews?.length || 0})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === 'description' && (
            <div className="max-w-3xl animate-[fadeIn_0.2s]">
              {product.description
                ? <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                    {product.description}
                  </div>
                : <p className="text-slate-400">Aucune description disponible.</p>
              }
            </div>
          )}

          {/* Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl animate-[fadeIn_0.2s]">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="card overflow-hidden">
                  {Object.entries(product.specs).map(([k,v], i) => (
                    <div key={k} className={`flex items-start gap-4 px-5 py-3.5 ${i%2===0 ? 'bg-slate-50 dark:bg-slate-900/40' : ''}`}>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide min-w-[120px] mt-0.5">{k}</span>
                      <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{v}</span>
                    </div>
                  ))}
                  {product.sku && (
                    <div className="px-5 py-3.5 flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide min-w-[120px]">Référence</span>
                      <span className="text-sm font-mono-pc text-slate-600 dark:text-slate-400">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide min-w-[120px]">Poids</span>
                      <span className="text-sm text-slate-800 dark:text-slate-200">{product.weight} g</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">Pas de caractéristiques techniques renseignées.</p>
              )}
            </div>
          )}

          {/* Avis */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl animate-[fadeIn_0.2s] space-y-5">
              {product.reviews?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun avis pour l'instant</p>
                  <p className="text-sm text-slate-400 mt-1">Soyez le premier à laisser un avis !</p>
                </div>
              ) : (
                product.reviews.map(r => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
                          {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                            {r.user?.firstName} {r.user?.lastName}
                          </p>
                          <Stars rating={r.rating} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(r.createdAt)}</span>
                    </div>
                    {r.title   && <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{r.title}</p>}
                    {r.comment && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>}
                    {r.adminReply && (
                      <div className="mt-3 pl-4 border-l-2 border-[#2563EB]">
                        <p className="text-xs font-bold text-[#2563EB] mb-1">Réponse Pierre-Cédric</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{r.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Produits similaires ── */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Produits similaires
            </h2>
            <ProductGrid products={related} loading={false} cols={4} />
          </div>
        )}
      </div>
    </div>
  );
}
