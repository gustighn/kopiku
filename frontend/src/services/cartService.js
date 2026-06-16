import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity });
export const updateCartItem = (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/remove/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');
