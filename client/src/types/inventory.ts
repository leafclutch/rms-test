export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    minStock: number;
    cost: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    icon: String;
    lastUpdated?:Date
  }