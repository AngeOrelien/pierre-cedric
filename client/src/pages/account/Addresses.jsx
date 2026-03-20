import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Modal   from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import toast   from 'react-hot-toast';

const PlusIcon   = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PencilIcon = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

const EMPTY = { label:'Domicile', recipientName:'', street:'', city:'Yaoundé', country:'Cameroun', phone:'', isDefault:false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);

  const load = () => userService.getAddresses().then(setAddresses).finally(()=>setLoading(false));
  useEffect(() => { load(); }, []);

  const open = (a=null) => { setEditing(a); setForm(a||EMPTY); setModal(true); };
  const set  = (k,v)    => setForm(f=>({...f,[k]:v}));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await userService.updateAddress(editing.id, form) : await userService.createAddress(form);
      toast.success(editing ? 'Adresse modifiée !' : 'Adresse ajoutée !');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    await userService.deleteAddress(id); toast.success('Adresse supprimée.'); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Mes adresses</h2>
        <button onClick={() => open()} className="btn btn-primary btn-sm">
          <PlusIcon className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {loading ? <div className="flex justify-center py-8"><Spinner /></div>
       : addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📍</div>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Aucune adresse enregistrée</p>
          <button onClick={() => open()} className="btn btn-primary btn-sm">Ajouter une adresse</button>
        </div>
       ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map(a => (
            <div key={a.id} className={`card p-5 relative ${a.isDefault?'ring-2 ring-[#2563EB]':''}`}>
              {a.isDefault && <span className="absolute top-3 right-3 badge badge-primary">Par défaut</span>}
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2">{a.label}</p>
              {a.recipientName && <p className="text-sm text-slate-600 dark:text-slate-300">{a.recipientName}</p>}
              <p className="text-sm text-slate-600 dark:text-slate-300">{a.street}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{a.city}, {a.country}</p>
              {a.phone && <p className="text-sm text-slate-500">{a.phone}</p>}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => open(a)} className="btn btn-ghost btn-sm flex items-center gap-1">
                  <PencilIcon className="w-3.5 h-3.5" /> Modifier
                </button>
                <button onClick={() => del(a.id)} className="btn btn-ghost btn-sm text-red-500 flex items-center gap-1">
                  <TrashIcon className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
       )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier l\'adresse' : 'Nouvelle adresse'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label">Libellé</label><input className="input" value={form.label} onChange={e=>set('label',e.target.value)} /></div>
            <div><label className="label">Destinataire</label><input className="input" value={form.recipientName} onChange={e=>set('recipientName',e.target.value)} /></div>
          </div>
          <div><label className="label">Adresse *</label><input required className="input" value={form.street} onChange={e=>set('street',e.target.value)} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label">Ville *</label><input required className="input" value={form.city} onChange={e=>set('city',e.target.value)} /></div>
            <div><label className="label">Pays</label><input className="input" value={form.country} onChange={e=>set('country',e.target.value)} /></div>
          </div>
          <div><label className="label">Téléphone</label><input className="input" value={form.phone} onChange={e=>set('phone',e.target.value)} /></div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e=>set('isDefault',e.target.checked)} className="text-[#2563EB]" />
            Définir comme adresse par défaut
          </label>
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Enregistrer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
