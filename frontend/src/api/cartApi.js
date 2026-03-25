import api from './axiosConfig';

export const cartApi = {
  getCart: () => api.get('/carts'),
  addItem: (productId, quantity) => api.post('/carts/items', { productId, quantity }),
  updateItem: (cartItemId, quantity) => api.put(`/carts/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/carts/items/${cartItemId}`),
  clearCart: () => api.delete('/carts'),
};
