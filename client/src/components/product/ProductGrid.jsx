import ProductCard from './ProductCard';
import { SkeletonCard } from '../common/Spinner';

export default function ProductGrid({ products = [], loading = false, cols = 4 }) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  }[cols] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  if (loading)
    return (
      <div className={`grid ${gridClass} gap-4 lg:gap-5`}>
        {Array(cols * 2).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );

  if (!products.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl mb-5">
          📦
        </div>
        <h3 className="font-display text-xl font-bold text-slate-700 dark:text-slate-300">Aucun produit trouvé</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    );

  return (
    <div className={`grid ${gridClass} gap-4 lg:gap-5`}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
