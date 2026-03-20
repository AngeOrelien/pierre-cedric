import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDateShort, ORDER_STATUS } from '../../utils/formatters';
import Modal     from '../../components/common/Modal';
import Spinner   from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import toast     from 'react-hot-toast';

const SearchIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [newSt,   setNewSt]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    adminService.getOrders({ page, limit:20, search, status })
      .then(d => { setOrders(d.orders||[]); setTotal(d.total||0); setPages(d.pages||1); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [page, search, status]);

  const update = async () => {
    setSaving(true);
    try { await adminService.updateOrder(modal.id, { status: newSt }); toast.success('Statut mis à jour !'); setModal(null); load(); }
    catch { toast.error('Erreur'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s]">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Commandes ({total})</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="N° commande…" className="input pl-10" />
        </div>
        <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}} className="input w-auto">
          <option value="">Tous les statuts</option>
          {STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS[s]?.label||s}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
          <table className="pc-table">
            <thead><tr><th>N°</th><th>Client</th><th>Montant</th><th>Paiement</th><th>Statut</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {orders.map(o => {
                const st = ORDER_STATUS[o.status]||{};
                return (
                  <tr key={o.id}>
                    <td><span className="font-mono-pc text-xs text-[#2563EB]">{o.orderNumber}</span></td>
                    <td><p className="text-sm font-medium">{o.user?.firstName} {o.user?.lastName}</p><p className="text-xs text-slate-400">{o.user?.email}</p></td>
                    <td><span className="font-semibold font-mono-pc text-sm">{formatPrice(o.total)}</span></td>
                    <td><span className={`badge ${o.paymentStatus==='paid'?'badge-success':'badge-warning'}`}>{o.paymentStatus}</span></td>
                    <td><span className={`badge badge-${st.color||'gray'}`}>{st.label||o.status}</span></td>
                    <td className="text-xs text-slate-400">{formatDateShort(o.createdAt)}</td>
                    <td>
                      <button onClick={()=>{setModal(o);setNewSt(o.status)}} className="btn btn-ghost btn-sm px-3">Gérer</button>
                    </td>
                  </tr>
                );
              })}
              {orders.length===0 && <tr><td colSpan={7} className="text-center py-10 text-slate-400">Aucune commande</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <Modal open={!!modal} onClose={()=>setModal(null)} title={`Commande ${modal?.orderNumber}`}>
        {modal && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-xs text-slate-400 mb-1 font-semibold">Client</p>
                <p className="font-medium text-sm">{modal.user?.firstName} {modal.user?.lastName}</p>
                <p className="text-xs text-slate-400">{modal.user?.email}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-xs text-slate-400 mb-1 font-semibold">Montant</p>
                <p className="font-bold text-[#2563EB] font-mono-pc">{formatPrice(modal.total)}</p>
              </div>
            </div>
            <div>
              <label className="label">Changer le statut</label>
              <select className="input" value={newSt} onChange={e=>setNewSt(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS[s]?.label||s}</option>)}
              </select>
            </div>
            <button onClick={update} disabled={saving} className="btn btn-primary w-full">
              {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Mettre à jour'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
