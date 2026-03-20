/**
 * Page d'accueil — inspirée de phonescanada.com
 *
 * IMAGES À REMPLACER (chercher REMPLACER_IMAGE) :
 *  - Hero background    : images.unsplash.com/photo-1491933382434-500287f9b54b
 *  - Catégories         : images.unsplash.com/...
 *  - Banners promos     : images.unsplash.com/...
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService }  from '../services/productService';
import { adminService }    from '../services/adminService';
import ProductGrid         from '../components/product/ProductGrid';
import { formatPrice }     from '../utils/formatters';

const ArrowRight = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const CheckIcon  = (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const StarIcon   = (p) => <svg {...p} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>;

/* Données catégories avec images Unsplash — REMPLACER par vos photos */
const CATEGORIES_VISUAL = [
  { icon:'📱', label:'Smartphones',   href:'/shop?categoryId=1',
    img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    count:'200+ produits' },
  { icon:'💻', label:'Laptops & PC',  href:'/shop?categoryId=2',
    img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    count:'150+ produits' },
  { icon:'🎧', label:'Accessoires',   href:'/shop?categoryId=3',
    img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    count:'500+ références' },
  { icon:'📟', label:'Tablettes',     href:'/shop?categoryId=4',
    img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    count:'80+ produits' },
  { icon:'🔊', label:'Audio',         href:'/shop?categoryId=5',
    img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    count:'120+ références' },
  { icon:'🎮', label:'Gaming',        href:'/shop?categoryId=6',
    img:'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&q=80',
    count:'60+ produits' },
];

/* Marques */
const BRANDS = ['Apple','Samsung','HP','Dell','Lenovo','Asus','Huawei','Xiaomi','Sony','JBL'];

/* Features */
const FEATURES = [
  { icon:'🚚', title:'Livraison rapide',    desc:'Yaoundé & Douala sous 24h' },
  { icon:'✅', title:'Produits certifiés',  desc:'100% authentiques & garantis' },
  { icon:'💳', title:'Paiement sécurisé',   desc:'Cash, Mobile Money, virement' },
  { icon:'🛡️', title:'Garantie SAV',        desc:'Support technique 7j/7' },
];

/* Témoignages */
const TESTIMONIALS = [
  { name:'Alain M.',  city:'Yaoundé',  text:'Livraison très rapide et produit conforme. Je recommande !', stars:5 },
  { name:'Béatrice N.', city:'Douala', text:'Excellent service client. Mon iPhone était bien emballé.', stars:5 },
  { name:'Cyrille T.', city:'Bafoussam', text:'Prix compétitifs et produits de qualité. Parfait !', stars:4 },
];

export default function Home() {
  const [featured,   setFeatured]   = useState([]);
  const [newProds,   setNewProds]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchQ,    setSearchQ]    = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productService.getAll({ featured:true, limit:8  }),
      productService.getAll({ isNew:true,    limit:4  }),
    ])
    .then(([feat, fresh]) => {
      setFeatured(feat.products || []);
      setNewProds(fresh.products || []);
    })
    .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/shop?search=${encodeURIComponent(searchQ)}`);
  };

  return (
    <div>
      {/* ══ HERO ═══════════════════════════════════════════════════════ */}
      {/*
        REMPLACER_IMAGE : hero background
        Remplacez l'URL ci-dessous par votre image dans src/assets/images/hero/hero-bg.jpg
        puis : style={{ backgroundImage: "url('/src/assets/images/hero/hero-bg.jpg')" }}
      */}
      <section
        className="relative min-h-[580px] md:min-h-[680px] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1920&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        {/* Overlay gradient directionnel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B36]/95 via-[#0D1B36]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B36]/60 via-transparent to-transparent" />

        {/* Particule déco */}
        <div className="absolute top-10 right-[20%] w-64 h-64 rounded-full bg-[#2563EB]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-[30%] w-48 h-48 rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="pc-container relative py-20 md:py-28">
          <div className="max-w-2xl animate-[slideUp_0.6s_ease-out]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                             bg-[#2563EB]/20 border border-[#2563EB]/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[#93C5FD] text-xs font-semibold tracking-wide">
                Votre boutique tech de confiance au Cameroun
              </span>
            </div>

            {/* Titre principal — police display */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold
                            text-white leading-[1.1] text-balance mb-5">
              Smartphones,
              <br/>
              <span className="text-[#F59E0B]">Laptops</span> &
              <br className="hidden sm:block"/>
              Accessoires
            </h1>

            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-xl">
              Des produits 100% authentiques livrés rapidement à Yaoundé et Douala.
              Garantie et service après-vente inclus.
            </p>

            {/* Checkpoints */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-9">
              {['Produits certifiés','Livraison 24h','Garantie constructeur','SAV 7j/7'].map(f => (
                <li key={f} className="flex items-center gap-2 text-[#CBD5E1] text-sm">
                  <CheckIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Barre de recherche hero */}
            <form onSubmit={handleSearch}
              className="flex items-stretch gap-2 max-w-xl mb-8">
              <div className="flex-1 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text" value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="iPhone 15, Samsung Galaxy, HP Laptop…"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/15 backdrop-blur border border-white/20
                             text-white placeholder:text-slate-400 focus:outline-none
                             focus:border-[#2563EB] focus:bg-white/25 transition-all text-sm"
                />
              </div>
              <button type="submit"
                className="btn btn-accent btn-lg rounded-xl px-6 whitespace-nowrap flex-shrink-0">
                Rechercher
              </button>
            </form>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary btn-lg rounded-xl">
                Explorer la boutique
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link to="/register"
                className="btn btn-lg rounded-xl border border-white/30 text-white bg-white/10 backdrop-blur hover:bg-white/20">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-[slideUp_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#080D1A] border-b border-slate-100 dark:border-slate-800">
        <div className="pc-container py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 dark:bg-[#2563EB]/20
                                flex items-center justify-center text-2xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{f.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATÉGORIES ══════════════════════════════════════════════════ */}
      <section className="section bg-slate-50 dark:bg-[#0A1020]">
        <div className="pc-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-2">Parcourir</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Nos Catégories
              </h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid catégories avec images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_VISUAL.map(cat => (
              <Link key={cat.label} to={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                {/* REMPLACER_IMAGE : image catégorie */}
                <img src={cat.img} alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B36]/90 via-[#0D1B36]/30 to-transparent" />
                {/* Contenu */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <p className="font-display font-bold text-white text-sm leading-tight">{cat.label}</p>
                  <p className="text-white/60 text-[10px] mt-1 group-hover:text-white/90 transition-colors">
                    {cat.count}
                  </p>
                </div>
                {/* Hover border */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-[#2563EB] ring-opacity-0 group-hover:ring-opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUITS VEDETTES ═══════════════════════════════════════════ */}
      <section className="section bg-white dark:bg-[#080D1A]">
        <div className="pc-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#F59E0B] text-sm font-semibold uppercase tracking-widest mb-2">Sélection</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Produits Vedettes ⭐
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Les meilleures ventes du moment</p>
            </div>
            <Link to="/shop?featured=true" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
        </div>
      </section>

      {/* ══ BANNIÈRE PROMOTIONNELLE ══════════════════════════════════════ */}
      {/*
        REMPLACER_IMAGE : image de la bannière
        Remplacez l'URL ci-dessous par src/assets/images/banners/promo-banner.jpg
      */}
      <section className="pc-container py-6">
        <div className="relative rounded-3xl overflow-hidden min-h-[220px] flex items-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400&q=80')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/95 via-[#1E3A5F]/80 to-transparent" />
          <div className="relative px-8 md:px-14 py-10">
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-2">Offre limitée</p>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
              Jusqu'à <span className="text-[#F59E0B]">−30%</span><br/>
              sur les Laptops
            </h3>
            <Link to="/shop?categoryId=2" className="btn btn-accent btn-lg rounded-xl">
              Profiter maintenant <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ NOUVEAUTÉS ══════════════════════════════════════════════════ */}
      {newProds.length > 0 && (
        <section className="section bg-slate-50 dark:bg-[#0A1020]">
          <div className="pc-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#22C55E] text-sm font-semibold uppercase tracking-widest mb-2">Arrivages</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Nouveautés 🆕
                </h2>
              </div>
              <Link to="/shop?isNew=true" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={newProds} loading={false} cols={4} />
          </div>
        </section>
      )}

      {/* ══ MARQUES ═════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white dark:bg-[#080D1A] border-y border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="pc-container">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Marques officielles disponibles
          </p>
          {/* Scroll infini via animation CSS */}
          <div className="flex gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-8 animate-[marquee_20s_linear_infinite] flex-shrink-0">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <Link key={i} to={`/shop?search=${b}`}
                  className="flex-shrink-0 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800
                             bg-white dark:bg-slate-900
                             hover:border-[#2563EB] hover:text-[#2563EB] transition-all
                             text-slate-500 dark:text-slate-400 text-sm font-semibold whitespace-nowrap">
                  {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TÉMOIGNAGES ═════════════════════════════════════════════════ */}
      <section className="section bg-slate-50 dark:bg-[#0A1020]">
        <div className="pc-container">
          <div className="text-center mb-12">
            <p className="text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-3">Avis clients</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Ce que disent nos clients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6 space-y-4">
                <div className="flex gap-0.5">
                  {Array(t.stars).fill(0).map((_,i) => (
                    <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center
                                   text-white text-xs font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA INSCRIPTION ═════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] py-16">
        <div className="pc-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez plus de 5 000 clients satisfaits
          </h2>
          <p className="text-[#93C5FD] text-lg mb-8 max-w-xl mx-auto">
            Inscrivez-vous pour recevoir nos meilleures offres et être notifié en avant-première des nouvelles arrivées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur border border-white/20
                         text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 text-sm" />
            <button className="btn btn-accent btn-lg rounded-xl">
              S'abonner
            </button>
          </div>
          <p className="text-white/40 text-xs mt-4">Aucun spam. Désabonnement en 1 clic.</p>
        </div>
      </section>
    </div>
  );
}
