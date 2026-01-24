import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem } from '../types/inventory';

interface InventoryStore {
  items: InventoryItem[];
  
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
  getLowStockItems: () => InventoryItem[];
  getOutOfStockItems: () => InventoryItem[];
}

const DUMMY_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Chicken', quantity: 250, unit: 'kg', minStock: 50, cost: 350, status: 'in-stock', icon: '🍗', lastUpdated: new Date() },
  { id: '2', name: 'Rice', quantity: 15, unit: 'kg', minStock: 50, cost: 80, status: 'low-stock', icon: '🍚', lastUpdated: new Date() },
  { id: '3', name: 'Vegetables', quantity: 0, unit: 'kg', minStock: 30, cost: 60, status: 'out-of-stock', icon: '🥬', lastUpdated: new Date() },
  { id: '4', name: 'Spices', quantity: 180, unit: 'kg', minStock: 20, cost: 200, status: 'in-stock', icon: '🌶️', lastUpdated: new Date() },
];

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: DUMMY_INVENTORY,

      addItem: (itemData) => {
        const newItem: InventoryItem = {
          ...itemData,
          id: `inv-${Date.now()}`,
          lastUpdated: new Date()
        };
        set(state => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, updates) => set(state => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, ...updates, lastUpdated: new Date() } : item
        )
      })),

      deleteItem: (id) => set(state => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateStock: (id, quantity) => {
        const item = get().items.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(0, quantity);
        const status: InventoryItem['status'] = 
          newQty === 0 ? 'out-of-stock' :
          newQty <= item.minStock ? 'low-stock' :
          'in-stock';

        get().updateItem(id, { quantity: newQty, status });
      },

      getLowStockItems: () => get().items.filter(i => i.status === 'low-stock'),
      getOutOfStockItems: () => get().items.filter(i => i.status === 'out-of-stock')
    }),
    { name: 'inventory-storage' }
  )
);