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
}