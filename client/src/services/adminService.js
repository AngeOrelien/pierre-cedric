import api from './api';
export const adminService = {
  getStats          : ()         => api.get('/admin/stats').then(r => r.data),
  getOrders         : (p)        => api.get('/admin/orders', { params:p }).then(r => r.data),
  updateOrder       : (id, d)    => api.put(`/admin/orders/${id}`, d).then(r => r.data),
  getCustomers      : (p)        => api.get('/admin/customers', { params:p }).then(r => r.data),
  getInventory      : ()         => api.get('/admin/inventory').then(r => r.data),
  adjustStock       : (pid, d)   => api.post(`/admin/stock/${pid}`, d).then(r => r.data),
  getReviews        : ()         => api.get('/admin/reviews').then(r => r.data),
  approveReview     : (id, d)    => api.put(`/admin/reviews/${id}`, d).then(r => r.data),
  getCategories     : ()         => api.get('/categories').then(r => r.data),
  createCategory    : (d)        => api.post('/categories', d).then(r => r.data),
  updateCategory    : (id, d)    => api.put(`/categories/${id}`, d).then(r => r.data),
  getBrands         : ()         => api.get('/brands').then(r => r.data),
  createBrand       : (d)        => api.post('/brands', d).then(r => r.data),
};
