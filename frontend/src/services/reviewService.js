import api from './api';

export const createReview = (data) => api.post('/reviews', data);
export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`);
