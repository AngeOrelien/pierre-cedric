# 📁 Images — Pierre-Cédric

## Structure

```
src/assets/images/
├── README.md
├── logo/
│   ├── logo-full.svg        ← Logo complet (couleurs)
│   ├── logo-full-white.svg  ← Logo blanc (pour fond sombre)
│   ├── logo-icon.svg        ← Icône seule (favicon, petits espaces)
│   └── logo-full.png        ← PNG fallback (1200×300 min)
│
├── hero/
│   ├── hero-bg.jpg          ← Image fond hero (1920×1080 min)
│   ├── hero-laptop.png      ← Produit mis en avant hero (PNG sans fond)
│   └── hero-phones.png
│
├── categories/
│   ├── smartphones.jpg      ← Photo catégorie smartphones (800×600)
│   ├── laptops.jpg
│   ├── accessories.jpg
│   ├── tablets.jpg
│   ├── audio.jpg
│   └── gaming.jpg
│
├── banners/
│   ├── promo-banner.jpg     ← Bannière promotionnelle (1200×400)
│   └── brand-banner.jpg
│
└── misc/
    ├── placeholder.png      ← Image produit par défaut (400×400)
    ├── empty-cart.svg
    └── empty-orders.svg
```

## Comment ajouter votre logo

### Option 1 — SVG (recommandé)
```jsx
// src/components/common/Logo.jsx
import logoFull  from '../../assets/images/logo/logo-full.svg';
import logoWhite from '../../assets/images/logo/logo-full-white.svg';

export default function Logo({ white = false, className = '' }) {
  return (
    <img
      src={white ? logoWhite : logoFull}
      alt="Pierre-Cédric Computer & Phone Solution"
      className={`h-10 w-auto ${className}`}
    />
  );
}
```

### Option 2 — PNG
```jsx
import logo from '../../assets/images/logo/logo-full.png';
<img src={logo} alt="Pierre-Cédric" className="h-10 w-auto object-contain" />
```

## Images produits uploadées
Les images produits sont gérées par le backend (Multer → `/uploads/`).
Elles sont servies via : `http://localhost:5000/uploads/nom-du-fichier.jpg`
Le proxy Vite les redirige automatiquement en dev.

## Images actuellement utilisées (en ligne — à remplacer)
Les composants utilisent des URLs Unsplash comme placeholder :
- `https://images.unsplash.com/...` → remplacer par vos propres images
- Cherchez `REMPLACER_IMAGE` dans les composants pour les trouver toutes.
