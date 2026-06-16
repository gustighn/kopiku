import api from './api';

export const validateCoupon = (code) => api.post('/coupons/validate', { code });
export const getCoupons = () => api.get('/coupons');
export const createCoupon = (data) => api.post('/coupons', data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);
