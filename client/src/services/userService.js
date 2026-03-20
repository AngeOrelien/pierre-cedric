import api from './api';
export const userService = {
  updateProfile : (form) => api.put('/users/profile', form, {
    headers:{ 'Content-Type':'multipart/form-data' }}).then(r => r.data),
  getAddresses  : ()     => api.get('/users/addresses').then(r => r.data.addresses),
  createAddress : (d)    => api.post('/users/addresses', d).then(r => r.data),
  updateAddress : (id,d) => api.put(`/users/addresses/${id}`, d).then(r => r.data),
  deleteAddress : (id)   => api.delete(`/users/addresses/${id}`).then(r => r.data),
};
