export interface MenuItem {
    id: string;
    name: string;
    price: number;
    quantity?:number;
    category: string;
    image?: string;
    description?: string;
    isVeg?: boolean;
    isAvailable: boolean;
    isSpecial: boolean
    prepTime?: number;
    createdAt?:Date;
    updatedAt?:Date;
  }
  
