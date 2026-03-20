/** Formatage prix en FCFA */
export const formatPrice = (amount) =>
  new Intl.NumberFormat('fr-CM', { style:'currency', currency:'XAF', minimumFractionDigits:0 })
    .format(Number(amount) || 0);

/** Formatage date en français */
export const formatDate = (date) =>
  new Intl.DateTimeFormat('fr-FR', { year:'numeric', month:'long', day:'numeric' })
    .format(new Date(date));

/** Date courte */
export const formatDateShort = (date) =>
  new Intl.DateTimeFormat('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' })
    .format(new Date(date));

/** Statuts de commande */
export const ORDER_STATUS = {
  pending    : { label:'En attente',    color:'warning', dot:'bg-yellow-400' },
  confirmed  : { label:'Confirmée',     color:'primary', dot:'bg-blue-400'   },
  processing : { label:'En traitement', color:'primary', dot:'bg-blue-500'   },
  shipped    : { label:'Expédiée',      color:'primary', dot:'bg-indigo-400' },
  delivered  : { label:'Livrée',        color:'success', dot:'bg-green-400'  },
  cancelled  : { label:'Annulée',       color:'danger',  dot:'bg-red-400'    },
  refunded   : { label:'Remboursée',    color:'gray',    dot:'bg-gray-400'   },
};

/** Statuts de paiement */
export const PAYMENT_STATUS = {
  pending  : { label:'En attente', color:'warning' },
  paid     : { label:'Payé',       color:'success' },
  failed   : { label:'Échoué',     color:'danger'  },
  refunded : { label:'Remboursé',  color:'gray'    },
};

/** Tronquer un texte */
export const truncate = (text, n = 80) =>
  text?.length > n ? text.slice(0, n) + '…' : text;

/** Calculer la réduction en % */
export const discountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};
