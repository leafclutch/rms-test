export type Department = "KITCHEN" | "DRINK" | "BAKERY" | "HUKKA";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  department: Department;
  category: string;
  quantity?: number;
  image?: string;
  description?: string;
  isVeg?: boolean | null;
  isAvailable: boolean;
  isSpecial: boolean;
  prepTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
