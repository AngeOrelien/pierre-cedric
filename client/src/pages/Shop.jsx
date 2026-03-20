import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { adminService }   from '../services/adminService';
import ProductGrid  from '../components/product/ProductGrid';
import Pagination   from '../components/common/Pagination';

const XIcon    = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const FilterIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const ChevronDown = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>;

const SORTS = [
  { label:'Plus récents',     value:'createdAt', order:'DESC' },
  { label:'Prix croissant',   value:'price',     order:'ASC'  },
  { label:'Prix décroissant', value:'price',     order:'DESC' },
  { label:'Meilleures ventes',value:'soldCount', order:'DESC' },
  { label:'Nom A–Z',          value:'name',      order:'ASC'  },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-sm font-bold
                   text-slate-700 dark:text-slate-300 mb-3 hover:text-[#2563EB] transition-colors">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  );
}

function PriceRange({ min, max, onChange }) {
  const presets = [
    { label:'Moins de 50 000 F', max:'50000' },
    { label:'50 000 – 150 000 F', min:'50000', max:'150000' },
    { label:'150 000 – 500 000 F', min:'150000', max:'500000' },
    { label:'Plus de 500 000 F', min:'500000' },
  ];
  return (
    <div className="space-y-2">
      {presets.map(p => {
        const active = (p.min || '') === min && (p.max || '') === max;
        return (
          <button key={p.label}
            onClick={() => onChange(p.min || '', p.max || '')}
            className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
              ${active ? 'bg-[#2563EB] text-white font-semibold'
                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {p.label}
          </button>
        );
      })}
      {/* Input custom */}
      <div className="flex items-center gap-2 mt-3">
        <input type="number" value={min} onChange={e => onChange(e.target.value, max)}
          placeholder="Min" className="input text-xs py-1.5 px-2" />
        <span className="text-slate-300">—</span>
        <input type="number" value={max} onChange={e => onChange(min, e.target.value)}
          placeholder="Max" className="input text-xs py-1.5 px-2" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [sp, setSP] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [sidebarOpen,setSidebar]    = useState(false);

  const page       = parseInt(sp.get('page')     || '1');
  const search     = sp.get('search')     || '';
  const categoryId = sp.get('categoryId') || '';
  const brandId    = sp.get('brandId')    || '';
  const minPrice   = sp.get('minPrice')   || '';
  const maxPrice   = sp.get('maxPrice')   || '';
  const featured   = sp.get('featured')   || '';
  const isNew      = sp.get('isNew')      || '';
  const sortIdx    = parseInt(sp.get('sortIdx') || '0');
  const sort       = SORTS[sortIdx] || SORTS[0];

  const setParam = useCallback((key, val) => {
    setSP(prev => {
      const n = new URLSearchParams(prev);
      val ? n.set(key, val) : n.delete(key);
      n.set('page', '1');
      return n;
    });
  }, [setSP]);

  useEffect(() => {
    setLoading(true);
    productService.getAll({
      page, limit:20, search, categoryId, brandId,
      minPrice, maxPrice, sort:sort.value, order:sort.order,
      featured: featured || undefined,
      isNew: isNew || undefined,
    })
    .then(d => { setProducts(d.products||[]); setTotal(d.total||0); setPages(d.pages||1); })
    .finally(() => setLoading(false));
  }, [sp]);

  useEffect(() => {
    Promise.all([adminService.getCategories(), adminService.getBrands()])
      .then(([c,b]) => { setCategories(c.categories||[]); setBrands(b.brands||[]); });
  }, []);

  const hasFilters = !!(categoryId || brandId || minPrice || maxPrice || search || featured || isNew);

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <div className="space-y-1">
      {/* Catégories */}
      <FilterSection title="Catégorie">
        <div className="space-y-1">
          <button onClick={() => { setParam('categoryId',''); setParam('page','1'); }}
            className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
              ${!categoryId ? 'bg-[#2563EB] text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            Toutes les catégories
          </button>
          {categories.map(c => (
            <button key={c.id}
              onClick={() => setParam('categoryId', String(c.id))}
              className={`flex items-center justify-between w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
                ${categoryId===String(c.id) ? 'bg-[#2563EB] text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Marques */}
      <FilterSection title="Marque">
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button onClick={() => setParam('brandId','')}
            className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
              ${!brandId ? 'bg-[#2563EB] text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            Toutes les marques
          </button>
          {brands.map(b => (
            <button key={b.id}
              onClick={() => setParam('brandId', String(b.id))}
              className={`flex items-center gap-2 w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
                ${brandId===String(b.id) ? 'bg-[#2563EB] text-white font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {b.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Prix */}
      <FilterSection title="Budget">
        <PriceRange min={minPrice} max={maxPrice}
          onChange={(mn,mx) => { setParam('minPrice',mn); setParam('maxPrice',mx); }} />
      </FilterSection>

      {/* Filtres spéciaux */}
      <FilterSection title="Filtre" defaultOpen>
        <div className="space-y-2">
          {[
            { label:'⭐ Produits vedettes', key:'featured', val:'true', active:featured==='true' },
            { label:'🆕 Nouveautés',        key:'isNew',    val:'true', active:isNew==='true'    },
          ].map(f => (
            <label key={f.key} className="flex items-center gap-2 cursor-pointer group">
              <div onClick={() => setParam(f.key, f.active ? '' : f.val)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                  ${f.active ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#2563EB]'}`}>
                {f.active && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {f.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      {hasFilters && (
        <button onClick={() => setSP({})}
          className="btn btn-outline w-full btn-sm text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
          <XIcon className="w-3.5 h-3.5" />
          Effacer tous les filtres
        </button>
      )}
    </div>
  );

  /* ── Breadcrumb contextuel ── */
  const currentCat = categories.find(c => String(c.id) === categoryId);

  return (
    <div className="bg-white dark:bg-[#080D1A] min-h-screen">
      {/* Header page */}
      <div className="bg-slate-50 dark:bg-[#0A1020] border-b border-slate-100 dark:border-slate-800 py-6">
        <div className="pc-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#2563EB] transition-colors">Accueil</Link>
            <span>›</span>
            <span className="text-slate-600 dark:text-slate-300">
              {currentCat ? currentCat.name : search ? `"${search}"` : 'Boutique'}
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {currentCat ? currentCat.name : search ? `Résultats pour "${search}"` : 'Boutique'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {loading ? '…' : `${total} produit${total !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select value={sortIdx} onChange={e => setParam('sortIdx', e.target.value)}
                className="input w-auto py-2 text-sm">
                {SORTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
              </select>
              <button onClick={() => setSidebar(true)}
                className="btn btn-outline btn-sm lg:hidden flex items-center gap-2">
                <FilterIcon className="w-4 h-4" />
                Filtres
                {hasFilters && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
              </button>
            </div>
          </div>

          {/* Tags actifs */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {search    && <span className="badge badge-primary">Recherche : {search} <button onClick={() => setParam('search','')} className="ml-1 opacity-60 hover:opacity-100">×</button></span>}
              {currentCat && <span className="badge badge-primary">{currentCat.name} <button onClick={() => setParam('categoryId','')} className="ml-1 opacity-60 hover:opacity-100">×</button></span>}
              {featured  && <span className="badge badge-accent">Vedettes <button onClick={() => setParam('featured','')} className="ml-1 opacity-60 hover:opacity-100">×</button></span>}
              {isNew     && <span className="badge badge-success">Nouveautés <button onClick={() => setParam('isNew','')} className="ml-1 opacity-60 hover:opacity-100">×</button></span>}
            </div>
          )}
        </div>
      </div>

      <div className="pc-container py-8">
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 card p-5">
              <div className="flex items-center gap-2 mb-5">
                <FilterIcon className="w-4.5 h-4.5 text-[#2563EB]" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Filtres</span>
                {hasFilters && <span className="badge badge-primary ml-auto">actifs</span>}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} cols={4} />
            <Pagination page={page} pages={pages} onPageChange={p => setParam('page', String(p))} />
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebar(false)} />
          <div className="relative w-72 bg-white dark:bg-[#0F172A] h-full shadow-2xl flex flex-col animate-[slideInRight_0.25s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-display font-bold text-slate-900 dark:text-white">Filtres</span>
              <button onClick={() => setSidebar(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <XIcon className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
