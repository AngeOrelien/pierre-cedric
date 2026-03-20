import api from './api';
export const productService = {
  getAll     : (params)   => api.get('/products', { params }).then(r => r.data),
  getOne     : (id)       => api.get(`/products/${id}`).then(r => r.data.product),
  create     : (data)     => api.post('/products', data).then(r => r.data),
  update     : (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  remove     : (id)       => api.delete(`/products/${id}`).then(r => r.data),
  uploadImages:(id,form)  => api.post(`/products/${id}/images`, form, {
    headers: { 'Content-Type':'multipart/form-data' }}).then(r => r.data),
  deleteImage:(pid,iid)   => api.delete(`/products/${pid}/images/${iid}`).then(r => r.data),
  getReviews : (id)       => api.get(`/products/${id}/reviews`).then(r => r.data.reviews),
};
