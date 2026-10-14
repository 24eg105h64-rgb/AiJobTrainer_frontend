import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : `${backendUrl}/api`,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aiJobTrainerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't loop if already on login/register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        localStorage.removeItem('aiJobTrainerToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
