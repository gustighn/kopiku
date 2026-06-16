import { create } from 'zustand';
import * as authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await authService.getMe();
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (data) => {
    const res = await authService.login(data);
    set({ user: res.data.data, isAuthenticated: true });
    return res.data;
  },

  register: async (data) => {
    const res = await authService.register(data);
    set({ user: res.data.data, isAuthenticated: true });
    return res.data;
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user })
}));

export default useAuthStore;
