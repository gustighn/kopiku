import api from './api';

export const getWishlist = () => api.get('/wishlist');
export const toggleWishlist = (productId) => api.post(`/wishlist/${productId}`);
