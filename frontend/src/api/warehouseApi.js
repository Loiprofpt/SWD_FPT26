import api from './axiosConfig';

export const warehouseApi = {
  getAll: () => api.get('/Warehouse'),
  create: (data) => api.post('/Warehouse/create', data),
  importStock: (data) => api.post('/Warehouse/import', data),
  getStockDetails: (productId) => api.get(`/Warehouse/stock-details/${productId}`),
};
