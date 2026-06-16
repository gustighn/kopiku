import { create } from 'zustand';
import * as cartService from '../services/cartService';

const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  fetchCart: async () => {
    try {
      const res = await cartService.getCart();
      const { items, totalItems, totalPrice } = res.data.data;
      set({ items: items || [], totalItems: totalItems || 0, totalPrice: totalPrice || 0 });
    } catch {
      set({ items: [], totalItems: 0, totalPrice: 0 });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const res = await cartService.addToCart(productId, quantity);
    await get().fetchCart();
    return res.data;
  },

  updateQuantity: async (itemId, quantity) => {
    await cartService.updateCartItem(itemId, quantity);
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await cartService.removeCartItem(itemId);
    await get().fetchCart();
  },

  clearCart: async () => {
    await cartService.clearCart();
    set({ items: [], totalItems: 0, totalPrice: 0 });
  }
}));

export default useCartStore;
