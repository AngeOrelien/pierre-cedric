import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { adminService }   from '../../services/adminService';
import { formatPrice }    from '../../utils/formatters';
import Modal     from '../../components/common/Modal';
import Spinner   from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import toast     from 'react-hot-toast';

const PlusIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon= (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const EditIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const PhotoIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const TrashIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

const EMPTY = { name:'', price:'', comparePrice:'', sku:'', stock:0, lowStockAlert:5, categoryId:'', brandId:'', isActive:true, isFeatured:false, isNew:false, shortDesc:'', description:'' };

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [imgModal,   setImgModal]   = useState(null);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [imgFiles,   setImgFiles]   = useState([]);
  const [saving,     setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    productService.getAll({ page, limit:15, search })
      .then(d => { setProducts(d.products||[]); setTotal(d.total||0); setPages(d.pages||1); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [page, search]);
  useEffect(() => {
    Promise.all([adminService.getCategories(), adminService.getBrands()])
      .then(([c,b]) => { setCategories(c.categories||[]); setBrands(b.brands||[]); });
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (p)  => { setEditing(p); setForm({...EMPTY,...p}); setModal(true); };
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await productService.update(editing.id, form)
              : await productService.create(form);
      toast.success(editing ? 'Produit mis à jour !' : 'Produit créé !');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Désactiver ce produit ?')) return;
    await productService.remove(id); toast.success('Produit désactivé.'); load();
  };

  const uploadImgs = async () => {
    if (!imgFiles.length) return;
    setSaving(true);
    const fd = new FormData();
    imgFiles.forEach(f => fd.append('images', f));
    try {
      await productService.uploadImages(imgModal, fd);
      toast.success('Images uploadées !'); setImgModal(null); setImgFiles([]);
    } catch { toast.error('Erreur upload'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Produits ({total})</h1>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <PlusIcon className="w-4 h-4" /> Nouveau produit
        </button>
      </div>

      <div className="relative max-w-xs">
        <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
          placeholder="Rechercher…" className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <table className="pc-table">
            <thead><tr><th>Produit</th><th>SKU</th><th>Prix</th><th>Stock</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => {
                const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&q=70';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.brand?.name || p.category?.name || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono-pc text-xs text-slate-500">{p.sku}</span></td>
                    <td><span className="font-semibold font-mono-pc text-sm">{formatPrice(p.price)}</span></td>
                    <td>
                      <span className={`badge ${p.stock===0?'badge-danger':p.stock<=p.lowStockAlert?'badge-warning':'badge-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td><span className={p.isActive?'badge-success badge':'badge-danger badge'}>{p.isActive?'Actif':'Inactif'}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={()=>openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Modifier">
                          <EditIcon className="w-4 h-4 text-slate-500" />
                        </button>
                        <button onClick={()=>{setImgModal(p.id);setImgFiles([])}} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Images">
                          <PhotoIcon className="w-4 h-4 text-[#2563EB]" />
                        </button>
                        <button onClick={()=>del(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Désactiver">
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length===0 && <tr><td colSpan={6} className="text-center py-10 text-slate-400">Aucun produit trouvé</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* Modal produit */}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Modifier le produit':'Nouveau produit'} size="xl">
        <form onSubmit={save} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <div>
            <label className="label">Nom du produit *</label>
            <input required className="input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: iPhone 15 Pro 256Go" />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className="label">Prix (FCFA) *</label><input required type="number" min="0" className="input" value={form.price} onChange={e=>set('price',e.target.value)} /></div>
            <div><label className="label">Prix barré</label><input type="number" min="0" className="input" value={form.comparePrice} onChange={e=>set('comparePrice',e.target.value)} /></div>
            <div><label className="label">SKU</label><input className="input" value={form.sku} onChange={e=>set('sku',e.target.value)} placeholder="PC-001" /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className="label">Stock</label><input type="number" min="0" className="input" value={form.stock} onChange={e=>set('stock',e.target.value)} /></div>
            <div><label className="label">Catégorie</label>
              <select className="input" value={form.categoryId} onChange={e=>set('categoryId',e.target.value)}>
                <option value="">— Aucune —</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="label">Marque</label>
              <select className="input" value={form.brandId} onChange={e=>set('brandId',e.target.value)}>
                <option value="">— Aucune —</option>
                {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Description courte</label>
            <input className="input" value={form.shortDesc} onChange={e=>set('shortDesc',e.target.value)} placeholder="Résumé affiché dans les listes produits" />
          </div>
          <div><label className="label">Description complète</label>
            <textarea rows={4} className="input resize-none" value={form.description} onChange={e=>set('description',e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-4">
            {[['isActive','Actif'],['isFeatured','Vedette'],['isNew','Nouveau']].map(([k,l])=>(
              <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form[k]} onChange={e=>set(k,e.target.checked)} className="text-[#2563EB]" /> {l}
              </label>
            ))}
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary w-full btn-lg">
            {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : (editing ? 'Enregistrer' : 'Créer le produit')}
          </button>
        </form>
      </Modal>

      {/* Modal images */}
      <Modal open={!!imgModal} onClose={()=>setImgModal(null)} title="Images du produit">
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-[#2563EB] transition-colors">
            <PhotoIcon className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-sm text-slate-500">Cliquez pour sélectionner</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={e=>setImgFiles(Array.from(e.target.files))} />
          </label>
          {imgFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imgFiles.map((f,i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <button onClick={uploadImgs} disabled={saving||!imgFiles.length} className="btn btn-primary w-full">
            {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : `Uploader (${imgFiles.length})`}
          </button>
        </div>
      </Modal>
    </div>
  );
}
