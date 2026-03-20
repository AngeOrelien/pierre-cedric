import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice }  from '../../utils/formatters';
import Modal   from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import toast   from 'react-hot-toast';

const WarnIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [adj,      setAdj]      = useState({ type:'in', quantity:'', reason:'' });
  const [saving,   setSaving]   = useState(false);

  const load = () => { adminService.getInventory().then(d=>setProducts(d.products||[])).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);

  const adjust = async () => {
    if (!adj.quantity || parseInt(adj.quantity) <= 0) { toast.error('Quantité invalide'); return; }
    setSaving(true);
    try {
      await adminService.adjustStock(modal.id, { ...adj, quantity:parseInt(adj.quantity) });
      toast.success('Stock ajusté !'); setModal(null); load();
    } catch { toast.error('Erreur'); } finally { setSaving(false); }
  };

  const lowStock = products.filter(p => p.stock <= p.lowStockAlert);

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s]">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Inventaire</h1>
        {lowStock.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-600 dark:text-amber-400 text-sm font-semibold">
            <WarnIcon className="w-4 h-4" /> {lowStock.length} en stock faible
          </div>
        )}
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
          <table className="pc-table">
            <thead><tr><th>Produit</th><th>SKU</th><th>Prix</th><th>Stock</th><th>Seuil</th><th>État</th><th></th></tr></thead>
            <tbody>
              {products.map(p => {
                const isLow = p.stock <= p.lowStockAlert;
                const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&q=70';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono-pc text-xs text-slate-500">{p.sku}</span></td>
                    <td><span className="font-semibold font-mono-pc text-sm">{formatPrice(p.price)}</span></td>
                    <td><span className={`font-display text-xl font-bold ${p.stock===0?'text-red-500':isLow?'text-amber-500':'text-green-500'}`}>{p.stock}</span></td>
                    <td className="text-sm text-slate-500">{p.lowStockAlert}</td>
                    <td>
                      {p.stock===0 ? <span className="badge badge-danger">Rupture</span>
                       : isLow      ? <span className="badge badge-warning">Faible</span>
                       :              <span className="badge badge-success">OK</span>}
                    </td>
                    <td>
                      <button onClick={()=>{setModal(p);setAdj({type:'in',quantity:'',reason:''})}}
                        className="btn btn-outline btn-sm px-3">Ajuster</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!modal} onClose={()=>setModal(null)} title={`Ajuster : ${modal?.name}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[['in','📥 Entrée'],['out','📤 Sortie'],['adjustment','🔧 Correction']].map(([v,l])=>(
              <label key={v} className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer text-center transition-all text-sm
                ${adj.type===v?'border-[#2563EB] bg-blue-50 dark:bg-blue-900/20 font-semibold text-[#2563EB]':'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                <input type="radio" name="t" value={v} checked={adj.type===v} onChange={()=>setAdj(a=>({...a,type:v}))} className="hidden" />
                {l}
              </label>
            ))}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-between">
            <span className="text-sm text-slate-500">Stock actuel</span>
            <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">{modal?.stock}</span>
          </div>
          <div><label className="label">Quantité</label>
            <input type="number" min="1" className="input" value={adj.quantity} onChange={e=>setAdj(a=>({...a,quantity:e.target.value}))} placeholder="Ex: 10" /></div>
          <div><label className="label">Raison <span className="text-slate-400 font-normal">(optionnel)</span></label>
            <input className="input" value={adj.reason} onChange={e=>setAdj(a=>({...a,reason:e.target.value}))} placeholder="Réapprovisionnement fournisseur…" /></div>
          <button onClick={adjust} disabled={saving} className="btn btn-primary w-full">
            {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Confirmer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
