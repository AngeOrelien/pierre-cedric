import api from './api';
export const authService = {
  register : (data)     => api.post('/auth/register', data).then(r => r.data),
  login    : (data)     => api.post('/auth/login', data).then(r => r.data),
  getMe    : ()         => api.get('/auth/me').then(r => r.data.user),
  updatePwd: (data)     => api.put('/auth/password', data).then(r => r.data),
};
