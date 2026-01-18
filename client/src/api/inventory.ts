// inventory.ts
import api from "./axios";

export interface PurchasePayload {
    itemName: string;
    quantity: number;
    unit?: string;
    costPerUnit?: number;
    totalCost?: number;
    supplierName?: string;
    supplierPhone?: string;
}

export const getInventory = async () => {
    const response = await api.get("/admin/inventory");
    return response.data;
};

export const recordPurchase = async (payload: PurchasePayload) => {
    const response = await api.post("/admin/inventory/purchase", payload);
    return response.data;
};

export const getInventoryTransactions = async (itemId: string) => {
    const response = await api.get(`/admin/inventory/${itemId}/transactions`);
    return response.data;
};
