import type { MenuItem } from "./menu";

export interface CartItem extends MenuItem {
    quantity: number;
  }
  
  export interface Cart {
    items: CartItem[];
    tableNumber?: string;
    totalAmount: number;
  }