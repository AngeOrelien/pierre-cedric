import api from './api';
export const cartService = {
  get       : ()         => api.get('/cart').then(r => r.data.cart),
  addItem   : (d)        => api.post('/cart/items', d).then(r => r.data.cart),
  updateItem: (id, d)    => api.put(`/cart/items/${id}`, d).then(r => r.data.cart),
  removeItem: (id)       => api.delete(`/cart/items/${id}`).then(r => r.data.cart),
  clear     : ()         => api.delete('/cart').then(r => r.data),
};
