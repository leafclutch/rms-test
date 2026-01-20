
export type OrderStatus = 'pending' | 'preparing' | 'served' | 'paid' | 'cancelled';
export type PaymentMethod = 'CASH' | 'ONLINE' | 'MIXED' | 'CREDIT';
export type DiscountType = 'PERCENT' | 'FIXED';
export type CustomerType = 'DINE_IN' | 'WALK_IN' | 'ONLINE';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  menuItem: {
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  orderNumber?: string;
  table?: {
    tableCode: string;
    tableType: string;
  };
  tableNumber?: string; // Mapped fallback
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  finalAmount?: number;
  cashAmount?: number;
  onlineAmount?: number;
  creditAmount?: number;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: PaymentMethod;
  discountType?: DiscountType;
  discountValue?: number;
  finalAmountAfterDiscount?: number;
  notes?: string;
}