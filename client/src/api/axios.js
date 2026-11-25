import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediguard_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — token expired (ignore on auth endpoints or login page)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/google') || url.includes('/auth/register') || url.includes('/auth/me');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('mediguard_token');
      localStorage.removeItem('mediguard_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
