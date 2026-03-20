import { useState } from 'react';
import Alert from '../components/common/Alert';

export default function Contact() {
  const [form, setForm]  = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent]  = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="bg-white dark:bg-[#080D1A] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] py-16 text-center text-white">
        <h1 className="font-display text-4xl font-bold mb-2">Contactez-nous</h1>
        <p className="text-[#93C5FD]">Notre équipe est disponible 7j/7 pour vous aider</p>
      </div>

      <div className="pc-container py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Info contact */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Nos coordonnées</h2>
            {[
              { icon:'📍', title:'Adresse', lines:['Centre Commercial Mvog-Ada','Yaoundé, Cameroun'] },
              { icon:'📞', title:'Téléphone', lines:['+237 655 000 000'] },
              { icon:'✉️', title:'Email',     lines:['contact@pierre-cedric.cm'] },
              { icon:'🕐', title:'Horaires',  lines:['Lun – Sam : 8h00 – 19h00','Dim : 10h00 – 16h00'] },
            ].map(c => (
              <div key={c.title} className="flex items-start gap-4 p-5 card rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{c.title}</p>
                  {c.lines.map((l,i) => <p key={i} className="text-sm text-slate-500 dark:text-slate-400">{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <div className="card p-8">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-6">Envoyer un message</h2>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📨</div>
                <Alert type="success" message="Message envoyé ! Nous vous répondrons dans les 24 heures." />
                <button onClick={() => setSent(false)} className="btn btn-outline btn-sm mt-5">Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Nom</label><input required className="input" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
                  <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
                </div>
                <div><label className="label">Sujet</label>
                  <select className="input" value={form.subject} onChange={e=>set('subject',e.target.value)}>
                    <option value="">Sélectionner un sujet</option>
                    {['Commande / Livraison','Retour / Remboursement','Problème technique','Renseignement produit','Autre'].map(s=>(
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div><label className="label">Message</label>
                  <textarea required rows={5} className="input resize-none" value={form.message} onChange={e=>set('message',e.target.value)}
                    placeholder="Décrivez votre demande…" />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-full">Envoyer le message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
