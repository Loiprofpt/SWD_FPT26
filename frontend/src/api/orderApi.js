import api from './axiosConfig';

export const orderApi = {
  create: (orderData) => api.post('/orders/from-cart', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  cancelMyOrder: (id) => api.post(`/orders/my/${id}/cancel`),
};
