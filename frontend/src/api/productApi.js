import api from './axiosConfig';

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  getBrands: () => api.get('/brands'),
};
