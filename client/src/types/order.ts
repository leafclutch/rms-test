import type { MenuItem } from './menu';

export interface Order {
  id: string;
  orderNumber?: string;
  tableNumber: string;
  items: MenuItem[];
  totalAmount: number;
  
  // ⭐ NEW FIELDS ADDED
  discount?: {
    type: 'fixed' | 'percentage';
    value: number;
    amount: number;
  };
  finalAmount?: number;
  paymentMethod?: 'cash' | 'online' | 'credit' | 'mixed';
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  serverId?: string;
}