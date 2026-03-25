import api from './axiosConfig';

export const orderApi = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  cancelMyOrder: (id) => api.post(`/orders/my/${id}/cancel`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, statusData) => api.put(`/orders/${id}`, statusData),
};
