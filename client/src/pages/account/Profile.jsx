import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import Alert   from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import toast   from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form,  setForm]  = useState({ firstName:user?.firstName||'', lastName:user?.lastName||'', phone:user?.phone||'' });
  const [pwd,   setPwd]   = useState({ currentPassword:'', newPassword:'' });
  const [loading,setLoading] = useState(false);
  const set  = (k,v) => setForm(f=>({...f,[k]:v}));
  const setP = (k,v) => setPwd(p=>({...p,[k]:v}));

  const handleProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      const { user:updated } = await userService.updateProfile(fd);
      updateUser(updated);
      toast.success('Profil mis à jour !');
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  const handlePwd = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await authService.updatePwd(pwd);
      toast.success('Mot de passe modifié !');
      setPwd({ currentPassword:'', newPassword:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Mon profil</h2>

      <form onSubmit={handleProfile} className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Informations personnelles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Prénom</label><input className="input" value={form.firstName} onChange={e=>set('firstName',e.target.value)} /></div>
          <div><label className="label">Nom</label><input className="input" value={form.lastName} onChange={e=>set('lastName',e.target.value)} /></div>
        </div>
        <div><label className="label">Téléphone</label><input className="input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+237 6XX XXX XXX" /></div>
        <div>
          <label className="label">Email</label>
          <input className="input opacity-60 cursor-not-allowed" value={user?.email} disabled />
          <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Enregistrer les modifications'}
        </button>
      </form>

      <form onSubmit={handlePwd} className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Changer le mot de passe</h3>
        <div><label className="label">Mot de passe actuel</label><input type="password" required className="input" value={pwd.currentPassword} onChange={e=>setP('currentPassword',e.target.value)} /></div>
        <div>
          <label className="label">Nouveau mot de passe</label>
          <input type="password" required minLength={6} className="input" value={pwd.newPassword} onChange={e=>setP('newPassword',e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-outline">
          {loading ? <Spinner size="sm" /> : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  );
}
