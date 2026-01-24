

import { create } from 'zustand';
import type { MenuItem } from '../types/menu';

interface CartStore {
  cart: (MenuItem & { quantity: number })[];

  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCustomerCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (item, quantity = 1) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      };
    }
    return { cart: [...state.cart, { ...item, quantity }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(i => i.id !== id)
  })),

  updateQuantity: (id, delta) => set((state) => ({
    cart: state.cart
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
  })),

  clearCart: () => set({ cart: [] }),

  getTotalAmount: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotalItems: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}));