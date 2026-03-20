import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert  from '../../components/common/Alert';
import Logo   from '../../components/common/Logo';
import Spinner from '../../components/common/Spinner';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : from, { replace:true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    /* REMPLACER_IMAGE : background illustration droite */
    <div className="min-h-screen flex">
      {/* Panneau gauche (formulaire) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#080D1A]">
        <div className="w-full max-w-sm animate-[slideUp_0.4s_ease-out]">
          <div className="mb-8">
            <Link to="/"><Logo size="md" /></Link>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            Bon retour ! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Connectez-vous à votre compte Pierre-Cédric
          </p>

          {error && <Alert type="error" message={error} className="mb-5" />}

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <input type="email" required autoFocus
                value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                placeholder="vous@example.com"
                className="input" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Mot de passe</label>
                <Link to="#" className="text-xs text-[#2563EB] hover:underline">Oublié ?</Link>
              </div>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required
                  value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
                  placeholder="••••••••" className="input pr-11" />
                <button type="button" onClick={() => setShowPwd(s=>!s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd
                    ? <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mt-2">
              {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Se connecter'}
            </button>
          </form>

          <div className="relative my-6">
            <hr className="divider" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#080D1A] px-3 text-xs text-slate-400">
              ou
            </span>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
              S'inscrire gratuitement →
            </Link>
          </p>
        </div>
      </div>

      {/* Panneau droite — illustration (masqué mobile) */}
      {/* REMPLACER_IMAGE : remplacez l'URL par votre image src/assets/images/hero/hero-laptop.png */}
      <div className="hidden lg:block flex-1 relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1620714223084-8fcacc2dfd8d?w=1200&q=80')`,
          backgroundSize:'cover', backgroundPosition:'center'
        }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/90 to-[#2563EB]/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Des milliers de produits tech vous attendent
          </h2>
          <p className="text-[#93C5FD] text-base max-w-sm">
            Smartphones, laptops, accessoires — livrés chez vous au Cameroun.
          </p>
        </div>
      </div>
    </div>
  );
}
