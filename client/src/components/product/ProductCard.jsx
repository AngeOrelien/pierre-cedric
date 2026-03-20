/**
 * ProductCard — carte produit responsive
 * IMAGES : utilise images.unsplash.com comme placeholder
 *          Chercher REMPLACER_IMAGE dans ce fichier pour les localiser
 */
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, discountPercent } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* Étoiles */
const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} viewBox="0 0 20 20" fill="currentColor"
        className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

/* Icône panier */
const CartIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuth }  = useAuth();

  /* REMPLACER_IMAGE : remplace l'URL Unsplash par votre image locale */
  const img = product.images?.[0]?.url
    || `https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80`;

  const disc      = discountPercent(product.price, product.comparePrice);
  const outOfStock = product.stock === 0;
  const lowStock   = !outOfStock && product.stock <= 5;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuth) { toast.error('Connectez-vous pour ajouter au panier'); return; }
    if (outOfStock) return;
    try {
      await addItem(product.id);
      toast.success('Ajouté au panier !', { icon:'🛒' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="card-hover group flex flex-col overflow-hidden">
      {/* Image */}
      <Link to={`/product/${product.slug}`}
        className="relative overflow-hidden bg-slate-50 dark:bg-slate-800">
        <div className="aspect-[4/3]">
          <img src={img} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={e => {
              /* REMPLACER_IMAGE : fallback local : e.target.src = '/src/assets/images/misc/placeholder.png' */
              e.target.src = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80`;
            }}
          />
        </div>

        {/* Overlay gradient */}
        <div className="product-overlay" />

        {/* Badges haut gauche */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew     && <span className="badge badge-navy text-[11px]">Nouveau</span>}
          {disc > 0          && <span className="badge badge-danger text-[11px]">−{disc}%</span>}
          {product.isFeatured && <span className="badge badge-accent text-[11px]">⭐ Vedette</span>}
        </div>

        {/* Bouton favori haut droite */}
        <button
          onClick={e => e.preventDefault()}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     transition-all duration-200 hover:bg-white hover:scale-110 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className="w-4 h-4 text-slate-500 hover:text-red-500 transition-colors">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Stock indicator overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <span className="badge badge-gray text-xs font-bold px-3 py-1.5">Rupture de stock</span>
          </div>
        )}
      </Link>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Brand / catégorie */}
        <p className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 uppercase tracking-widest">
          {product.brand?.name || product.category?.name || 'Pierre-Cédric'}
        </p>

        {/* Nom */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200
                          line-clamp-2 leading-snug
                          hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <Stars rating={4} />
          <span className="text-[11px] text-slate-400">(12)</span>
        </div>

        {/* Prix + Stock */}
        <div className="mt-auto space-y-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-[#2563EB] dark:text-blue-400 font-mono-pc">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-mono-pc">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Indicateur stock */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              outOfStock ? 'bg-red-400'
              : lowStock  ? 'bg-amber-400'
              :             'bg-green-400'
            }`} />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {outOfStock ? 'Rupture de stock'
               : lowStock  ? `Plus que ${product.stock} !`
               :             'En stock'}
            </span>
          </div>

          {/* CTA */}
          <button onClick={handleAdd} disabled={outOfStock}
            className={`btn w-full text-sm ${outOfStock ? 'btn-ghost cursor-not-allowed' : 'btn-primary'}`}>
            {!outOfStock && <CartIcon className="w-4 h-4" />}
            {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
