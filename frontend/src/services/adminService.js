import api from './api';

export const getDashboard = () => api.get('/admin/dashboard');
export const getUsers = () => api.get('/admin/users');
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAnalytics = () => api.get('/admin/analytics');
