import type { InventoryItem } from "../types/inventory";
import type { MenuItem } from "../types/menu";
import type { Order } from "../types/order";

export const DUMMY_MENU_ITEMS: MenuItem[] = [
    { id: '1', name: 'Khukuri', price: 10, category: 'Smokes', image: '🚬', isVeg: false, isAvailable: true, description: 'Premium cigarette brand' },
    { id: '2', name: 'Shikhar Ice', price: 25, category: 'Smokes', image: '🧊', isVeg: true, isAvailable: true, description: 'Refreshing menthol cigarette' },
    { id: '3', name: 'Surya Light', price: 30, category: 'Smokes', image: '☀️', isVeg: false, isAvailable: true },
    { id: '4', name: 'Surya Red', price: 30, category: 'Smokes', image: '🔴', isVeg: false, isAvailable: true },
    { id: '5', name: 'Chicken Momo', price: 150, category: 'Chatpatey Items', image: '🥟', isVeg: false, isAvailable: true, description: 'Steamed chicken dumplings with spicy sauce' },
    { id: '6', name: 'Veg Momo', price: 120, category: 'Chatpatey Items', image: '🥟', isVeg: true, isAvailable: true, description: 'Steamed vegetable dumplings' },
    { id: '7', name: 'Chicken Chowmein', price: 180, category: 'Chowmein', image: '🍜', isVeg: false, isAvailable: true, description: 'Stir-fried noodles with chicken' },
    { id: '8', name: 'Egg Chowmein', price: 150, category: 'Chowmein', image: '🍳', isVeg: false, isAvailable: true },
    { id: '9', name: 'Dal Bhat', price: 200, category: 'Nepali Thali', image: '🍛', isVeg: true, isAvailable: true, description: 'Traditional Nepali meal with lentils and rice' },
    { id: '10', name: 'Chicken Thali', price: 350, category: 'Nepali Thali', image: '🍗', isVeg: false, isAvailable: true },
    { id: '11', name: 'Coca Cola', price: 80, category: 'Drink', image: '🥤', isVeg: true, isAvailable: true },
    { id: '12', name: 'Mango Lassi', price: 120, category: 'Drink', image: '🥭', isVeg: true, isAvailable: true, description: 'Refreshing yogurt-based drink' },
  ];
  
  export const DUMMY_ORDERS: Order[] = [
    { id: 'ORD001', tableNumber: 'T1', items: [], totalAmount: 450, status: 'pending', createdAt: new Date(Date.now() - 600000), customerName: 'Ram Sharma' },
    { id: 'ORD002', tableNumber: 'C2', items: [], totalAmount: 780, status: 'preparing', createdAt: new Date(Date.now() - 1500000), customerName: 'Sita Thapa' },
    { id: 'ORD003', tableNumber: 'T3', items: [], totalAmount: 250, status: 'completed', createdAt: new Date(Date.now() - 2700000), customerName: 'Hari Poudel' },
    { id: 'ORD004', tableNumber: 'T5', items: [], totalAmount: 920, status: 'preparing', createdAt: new Date(Date.now() - 1200000), customerName: 'Gita Rai' },
    { id: 'ORD005', tableNumber: 'C1', items: [], totalAmount: 650, status: 'pending', createdAt: new Date(Date.now() - 300000), customerName: 'Krishna KC' },
  ];
  
  export const DUMMY_INVENTORY: InventoryItem[] = [
    { id: '1', name: 'Chicken', quantity: 250, unit: 'kg', minStock: 50, status: 'in-stock', icon: '🍗' },
    { id: '2', name: 'Rice', quantity: 15, unit: 'kg', minStock: 50, status: 'low-stock', icon: '🍚' },
    { id: '3', name: 'Vegetables', quantity: 0, unit: 'kg', minStock: 30, status: 'out-of-stock', icon: '🥬' },
    { id: '4', name: 'Spices', quantity: 180, unit: 'kg', minStock: 20, status: 'in-stock', icon: '🌶️' },
    { id: '5', name: 'Oil', quantity: 45, unit: 'L', minStock: 20, status: 'in-stock', icon: '🛢️' },
    { id: '6', name: 'Flour', quantity: 12, unit: 'kg', minStock: 40, status: 'low-stock', icon: '🌾' },
  ];
  
  export const CATEGORIES = ['All', 'Smokes', 'Non-Veg', 'Veg', 'Chatpatey Items', 'Chowmein', 'Nepali Thali', 'Drink'];
  