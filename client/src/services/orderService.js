import api from './api';
export const orderService = {
  create  : (data) => api.post('/orders', data).then(r => r.data),
  getMine : ()     => api.get('/orders').then(r => r.data.orders),
  getOne  : (id)   => api.get(`/orders/${id}`).then(r => r.data.order),
  cancel  : (id)   => api.put(`/orders/${id}/cancel`).then(r => r.data),
};
