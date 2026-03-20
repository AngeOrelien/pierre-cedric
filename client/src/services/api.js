/**
 * Instance Axios centralisée
 * - Injecte le token JWT automatiquement
 * - Redirige vers /login si 401
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur requête : injecter token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse : gérer l'expiration
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pc_token');
      localStorage.removeItem('pc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
