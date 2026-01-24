import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { MenuItem } from '../types/menu';

interface CartStore {
  items: CartItem[];
  tableNumber: string;
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setTableNumber: (table: string) => void;
  toggleCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableNumber: '',
  isOpen: false,

  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),

  updateQuantity: (id, delta) => set((state) => ({
    items: state.items
      .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      .filter(i => i.quantity > 0)
  })),

  clearCart: () => set({ items: [], tableNumber: '' }),

  setTableNumber: (table) => set({ tableNumber: table }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalAmount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));