/**
 * Fonctions utilitaires partagées dans le backend
 */

/**
 * Génère un slug URL-friendly depuis un texte
 * Ex: "iPhone 15 Pro Max" → "iphone-15-pro-max"
 */
const generateSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9\s-]/g, '')    // supprime les caractères spéciaux
    .replace(/\s+/g, '-')            // espaces → tirets
    .replace(/-+/g, '-')             // tirets multiples → un seul
    .trim();

/**
 * Génère un numéro de commande unique
 * Format : PC-YYYYMMDD-XXXX (ex: PC-20241015-4823)
 */
const generateOrderNumber = () => {
  const now  = new Date();
  const y    = now.getFullYear();
  const m    = String(now.getMonth() + 1).padStart(2, '0');
  const d    = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `PC-${y}${m}${d}-${rand}`;
};

/**
 * Calcule les paramètres de pagination depuis la query string
 * @param {object} query  - req.query
 * @param {number} defaultLimit
 */
const getPagination = (query, defaultLimit = 20) => {
  const page   = Math.max(1, parseInt(query.page)  || 1);
  const limit  = Math.min(100, parseInt(query.limit) || defaultLimit);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Formate la réponse paginée
 */
const paginatedResponse = (data, count, page, limit) => ({
  data,
  pagination: {
    total      : count,
    page,
    limit,
    totalPages : Math.ceil(count / limit),
    hasNext    : page * limit < count,
    hasPrev    : page > 1,
  },
});

/**
 * Génère un SKU aléatoire
 * Ex: PC-A3F9X2
 */
const generateSku = (prefix = 'PC') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result  = prefix + '-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = { generateSlug, generateOrderNumber, getPagination, paginatedResponse, generateSku };
