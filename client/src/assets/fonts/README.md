# 📁 Polices personnalisées — Pierre-Cédric

## Structure recommandée

```
src/assets/fonts/
├── README.md              ← ce fichier
│
├── display/               ← Police HERO / titres principaux
│   ├── Syne-Bold.woff2
│   ├── Syne-Bold.ttf
│   ├── Syne-SemiBold.woff2
│   └── Syne-SemiBold.ttf
│
├── body/                  ← Police CORPS / texte courant
│   ├── Outfit-Regular.woff2
│   ├── Outfit-Regular.ttf
│   ├── Outfit-Medium.woff2
│   ├── Outfit-Medium.ttf
│   ├── Outfit-SemiBold.woff2
│   └── Outfit-SemiBold.ttf
│
└── mono/                  ← Police MONO / codes, prix, SKU
    ├── JetBrainsMono-Regular.woff2
    └── JetBrainsMono-Regular.ttf
```

## Comment changer une police (.ttf téléchargé)

1. Téléchargez votre police (ex: depuis Google Fonts, DaFont, etc.)
2. Copiez les fichiers `.ttf` dans le bon dossier ci-dessus
3. Convertissez en `.woff2` pour de meilleures performances :
   https://cloudconvert.com/ttf-to-woff2
4. Mettez à jour `src/styles/index.css` — section `@font-face` :

```css
/* ═══ POLICE DISPLAY (Hero / H1 / Titres) ═══ */
@font-face {
  font-family: 'MaPoliceDisplay';
  src: url('../assets/fonts/display/MaPoliceDisplay-Bold.woff2') format('woff2'),
       url('../assets/fonts/display/MaPoliceDisplay-Bold.ttf')  format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* ═══ POLICE BODY (Texte courant) ═══ */
@font-face {
  font-family: 'MaPoliceBody';
  src: url('../assets/fonts/body/MaPoliceBody-Regular.woff2') format('woff2'),
       url('../assets/fonts/body/MaPoliceBody-Regular.ttf')  format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'MaPoliceBody';
  src: url('../assets/fonts/body/MaPoliceBody-Medium.woff2') format('woff2'),
       url('../assets/fonts/body/MaPoliceBody-Medium.ttf')  format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

5. Mettez à jour les variables dans `@theme {}` :

```css
@theme {
  --font-display: "MaPoliceDisplay", sans-serif;
  --font-sans:    "MaPoliceBody",    system-ui, sans-serif;
}
```

## Polices actuellement chargées (Google Fonts via index.html)

| Variable CSS    | Police actuelle | Usage                        |
|-----------------|-----------------|------------------------------|
| `--font-display`| Syne 700/800    | Hero, H1, titres de section  |
| `--font-sans`   | Outfit 400-700  | Corps, menus, boutons, UI    |

## Exemples de polices display alternatives

| Police          | Style          | Téléchargement               |
|-----------------|----------------|------------------------------|
| Clash Display   | Moderne/Tech   | https://www.fontshare.com    |
| Cabinet Grotesk | Editorial      | https://www.fontshare.com    |
| General Sans    | Neutre premium | https://www.fontshare.com    |
| Satoshi         | Clean/Bold     | https://www.fontshare.com    |
| Neue Machina    | Techno         | https://pangrampangram.com   |

