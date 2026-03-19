# PIERRE-CÉDRIC

## Computer & Phone Solution

Guide complet de développement d’une application e-commerce full-stack (React + Express + Sequelize + SQLite).  
Architecture MVC, API REST sécurisée JWT, UI Tailwind CSS.

---

## 🚀 Présentation

**Pierre-Cédric** est un projet monorepo e-commerce avec :

- Frontend React (Vite)
- Backend Express (Node.js)
- ORM Sequelize + SQLite (dev)
- Auth JWT + bcrypt
- Upload images produit (Multer)
- Tests backend (Jest + Supertest) et frontend (Vitest + RTL)

---

## 🧱 Architecture

Monorepo :

- client : application React
- server : API REST Express
- package.json racine : scripts de démarrage simultané
- README.md : documentation
- `.env` : variables d’environnement

---

## 📦 Stack technique

- **Frontend** : React 18 + Vite + React Router v6
- **CSS** : TailwindCSS 3
- **Backend** : Node.js + Express
- **Base** : SQLite (dév) / PostgreSQL (prod)
- **ORM** : Sequelize
- **Auth** : JWT + bcrypt
- **Upload** : Multer
- **Tests** : Jest + Supertest / Vitest + React Testing Library

---

## 📁 Arborescence principale

### Racine (`/`)
- client
- server
- package.json
- .gitignore
- README.md

### Backend (server)
- `config/` : Express, Sequelize
- `models/` : utilisateurs, produits, commandes, etc.
- `controllers/` : logique métier
- `routes/` : API endpoints
- `middlewares/` : auth, admin, upload, erreurs
- `services/` : email (Nodemailer)
- `utils/` : helpers, validation
- `tests/`
- `uploads/`
- `index.js`

### Frontend (src)
- `components/` (common, product, cart, admin)
- `pages/` (shop, cart, checkout, auth, compte, admin)
- `context/` (Auth, Cart)
- `hooks/`
- `services/` (axios + API)
- `router/` (routes, guards)
- `App.jsx`, `main.jsx`
- `tailwind.config.js`, `vite.config.js`

---

## ⚙️ Installation

```bash
git clone https://github.com/AngeOrelien/pierre-cedric.git
cd pierre-cedric
npm install
# si monorepo with yarn workspace or npm workspaces, voir package root
```

---

## ▶️ Exécution (dev)

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Exécution monorepo (si script root)

```bash
npm run dev
```

---

## 🔐 Variables d’environnement (exemple)

Dans .env :

```
PORT=5000
JWT_SECRET=supersecret
DB_STORAGE=./database.sqlite
```

---

## 🧪 Tests

### Backend

```bash
cd server
npm test
```

### Frontend

```bash
cd client
npm test
```

---

## 🧭 API Principale

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Produits: `/api/products/*`
- Categories: `/api/categories/*`
- Brands: `/api/brands/*`
- Panier: `/api/cart/*`
- Commandes: `/api/orders/*`
- Reviews: `/api/reviews/*`
- Admin: `/api/admin/*`

---

## 🔧 Contribution

1. Fork
2. Branch feature
3. Commit clair
4. PR avec description et tests
5. Review & merge

---

## 📜 Licence

MIT License

---

> Projet e-commerce Full-Stack maintenu par **Ange Orelien**.