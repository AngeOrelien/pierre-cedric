import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Modal   from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import toast   from 'react-hot-toast';

const PlusIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const EMPTY = { name:'', description:'', icon:'', sortOrder:0, isActive:true };

export default function AdminCategories() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const load = () => adminService.getCategories().then(d=>setCats(d.categories||[])).finally(()=>setLoading(false));
  useEffect(() => { load(); }, []);
  const open = (c=null) => { setEditing(c); setForm(c||EMPTY); setModal(true); };
  const set  = (k,v)   => setForm(f=>({...f,[k]:v}));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await adminService.updateCategory(editing.id, form) : await adminService.createCategory(form);
      toast.success(editing?'Mise à jour !':'Créée !'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s]">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Catégories</h1>
        <button onClick={()=>open()} className="btn btn-primary"><PlusIcon className="w-4 h-4" /> Nouvelle</button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map(c => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {c.icon||'📦'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.children?.length||0} sous-catégorie(s)</p>
                </div>
              </div>
              <button onClick={()=>open(c)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
                <EditIcon className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Modifier':'Nouvelle catégorie'}>
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Nom *</label><input required className="input" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
          <div><label className="label">Icône (emoji ou nom)</label><input className="input" value={form.icon} onChange={e=>set('icon',e.target.value)} placeholder="📱 ou device-phone-mobile" /></div>
          <div><label className="label">Description</label><textarea rows={3} className="input resize-none" value={form.description} onChange={e=>set('description',e.target.value)} /></div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e=>set('isActive',e.target.checked)} className="text-[#2563EB]" /> Active
          </label>
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving?<Spinner size="sm" className="border-white border-t-transparent"/>:'Enregistrer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
