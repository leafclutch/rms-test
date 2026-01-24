// orders.ts
import api from "./axios";

// --- CUSTOMER ENDPOINTS ---

export const createOrder = async (payload: {
  tableCode?: string;
  customerType: "DINE_IN" | "WALK_IN" | "ONLINE";
  items: { menuItemId: string; quantity: number }[];
  customerName?: string;
  mobileNumber?: string;
}) => {
  const response = await api.post("/orders", payload);
  return response.data;
};

// Fetch single order by ID (customer tracking)
export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// --- ADMIN ENDPOINTS (Protected) ---

// Fetch all active orders (pending, preparing, served)
export const getActiveOrders = async () => {
  const response = await api.get("/admin/orders/active");
  return response.data.orders;
};

// Alias for compatibility with old stores
export async function getOrders() {
  return await getActiveOrders();
}

// Fetch past/paid orders
export const getOrderHistory = async () => {
  const response = await api.get("/admin/orders/history");
  return response.data.orders;
};

// Mark order as preparing
export const preparingOrder = async (orderId: string) => {
  const response = await api.patch(`/admin/orders/${orderId}/preparing`);
  return response.data;
};

// Mark order as served
export const serveOrder = async (orderId: string) => {
  const response = await api.patch(`/admin/orders/${orderId}/serve`);
  return response.data;
};

export const getOrderBill = async (orderId: string) => {
  const response = await api.get(`/admin/orders/${orderId}/bill`);
  return response.data.order;
};

// Add more items to an existing order
export const addItemsToOrder = async (orderId: string, items: { menuItemId: string, quantity: number }[]) => {
  const response = await api.post(`/admin/orders/${orderId}/items`, { items });
  return response.data;
};

// Reduce quantity of an item in an order
export const reduceOrderItem = async (orderId: string, menuItemId: string, quantity: number = 1) => {
  const response = await api.patch(`/admin/orders/${orderId}/items/${menuItemId}/reduce`, { quantity });
  return response.data;
};

// Remove/Cancel an item from an order
export const cancelOrderItem = async (orderId: string, menuItemId: string) => {
  const response = await api.delete(`/admin/orders/${orderId}/items/${menuItemId}`);
  return response.data;
};

