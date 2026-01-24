// FILE: src/types/Customer.ts

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalCredit: number;
  creditLimit?: number;
  creditHistory: CreditTransaction[];
  createdAt: Date;
  updatedAt?: Date;
  ledgerCount?: number;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  orderId?: string;
  type: 'debt' | 'payment';
  amount: number;
  balance: number;
  notes?: string;
  timestamp: Date;
  order?: {
    id: string;
    items: Array<{
      id: string;
      quantity: number;
      menuItem: {
        name: string;
        price: number;
      };
    }>;
  };
}