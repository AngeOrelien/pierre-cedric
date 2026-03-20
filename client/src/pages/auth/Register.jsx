import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext';
import Alert  from '../../components/common/Alert';
import Logo   from '../../components/common/Logo';
import Spinner from '../../components/common/Spinner';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ firstName:'', lastName:'', email:'', password:'', phone:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/', { replace:true });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#080D1A] overflow-y-auto">
        <div className="w-full max-w-sm py-8 animate-[slideUp_0.4s_ease-out]">
          <div className="mb-8"><Link to="/"><Logo size="md" /></Link></div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            Créer un compte 🚀
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Rejoignez la communauté Pierre-Cédric
          </p>

          {error && <Alert type="error" message={error} className="mb-5" />}

          <form onSubmit={handle} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Prénom</label>
                <input required value={form.firstName} onChange={e=>set('firstName',e.target.value)}
                  placeholder="Jean" className="input" autoFocus />
              </div>
              <div>
                <label className="label">Nom</label>
                <input required value={form.lastName} onChange={e=>set('lastName',e.target.value)}
                  placeholder="Dupont" className="input" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required value={form.email} onChange={e=>set('email',e.target.value)}
                placeholder="vous@example.com" className="input" />
            </div>
            <div>
              <label className="label">Téléphone <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)}
                placeholder="+237 6XX XXX XXX" className="input" />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input type={showPwd?'text':'password'} required minLength={6}
                  value={form.password} onChange={e=>set('password',e.target.value)}
                  placeholder="Minimum 6 caractères" className="input pr-11" />
                <button type="button" onClick={() => setShowPwd(s=>!s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPwd
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
              {/* Force du mdp */}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(l => (
                    <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= l*3
                        ? l<=1 ? 'bg-red-400' : l<=2 ? 'bg-amber-400' : l<=3 ? 'bg-blue-400' : 'bg-green-400'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mt-2">
              {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">Se connecter →</Link>
          </p>
          <p className="text-center text-xs text-slate-400 mt-4">
            En créant un compte, vous acceptez nos{' '}
            <Link to="#" className="underline hover:text-slate-600">CGV</Link> et notre{' '}
            <Link to="#" className="underline hover:text-slate-600">politique de confidentialité</Link>.
          </p>
        </div>
      </div>

      {/* Panneau droite */}
      {/* REMPLACER_IMAGE */}
      <div className="hidden lg:block flex-1 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80')`,
          backgroundSize:'cover', backgroundPosition:'center'
        }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/90 to-[#2563EB]/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-5">🎁</div>
          <h2 className="font-display text-3xl font-bold mb-3">Avantages membres</h2>
          {['Offres exclusives réservées aux membres','Suivi commande en temps réel','SAV prioritaire','Historique complet de vos achats'].map(a => (
            <div key={a} className="flex items-center gap-2 text-[#93C5FD] text-sm mt-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-green-400 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
