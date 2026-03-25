import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect nếu đang KHÔNG ở trang login (tránh redirect loop)
      // và chỉ khi endpoint liên quan đến auth (token hết hạn)
      const isLoginPage = window.location.pathname === '/login';
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isLoginPage && !isAuthEndpoint) {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
