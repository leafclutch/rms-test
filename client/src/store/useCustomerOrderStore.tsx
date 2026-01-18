// import { create } from "zustand";
// import { toast } from "react-hot-toast";
// import type { MenuItem } from "../types/menu";
// import { createOrder } from "../api/orders";

// export interface CustomerOrder {
//   orderId: string; // backend-generated ID
//   orderNumber: string;
//   items: { menuItemId: string; quantity: number }[];
//   totalAmount: number;
//   finalAmount?: number;
//   status: "pending" | "preparing" | "completed";
//   createdAt: string; // ISO string from backend
//   tableCode?: string;
//   customerType: "DINE-IN" | "WALK-IN" | "ONLINE";
//   customerName?: string;
//   mobileNumber?: string;
// }

// interface CustomerOrderStore {
//   recentOrder: CustomerOrder | null;
//   orders: CustomerOrder[];

//   createOrder: (payload: {
//     items: (MenuItem & { quantity: number })[];
//     tableCode?: string;
//     customerType: "DINE-IN" | "WALK-IN" | "ONLINE";
//     customerName?: string;
//     mobileNumber?: string;
//   }) => Promise<CustomerOrder | null>;

//   getOrderById: (id: string) => Promise<CustomerOrder | null>;
//   updateOrderStatus: (id: string, status: "pending" | "preparing" | "completed") => Promise<void>;
//   fetchOrders: () => Promise<void>;
// }

// export const useCustomerOrderStore = create<CustomerOrderStore>((set, get) => ({
//   recentOrder: null,
//   orders: [],

//   // Create a new order using the API
//   createOrder: async ({ items, tableCode, customerType}) => {
//     try {
//       // Map items to correct shape for API: { menuItemId, quantity }
//       const mappedItems = items.map(item => ({
//         menuItemId: item.id,
//         quantity: item.quantity
//       }));
//       const newOrder = await createOrder({
//         items: mappedItems,
//         tableCode,
//         customerType,
//       });

//       if (!newOrder) {
//         throw new Error("Order creation failed");
//       }

//       // Update local store
//       set({ recentOrder: newOrder, orders: [...get().orders, newOrder] });

//       toast.success("Order placed successfully!");

//       return newOrder;
//     } catch (error: any) {
//       console.error("Create order failed:", error);
//       toast.error(error?.response?.data?.message || error?.message || "Failed to create order");
//       return null;
//     }
//   },

//   // Get single order by ID (front-end only, no backend API)
//   getOrderById: async (id: string) => {
//     const { orders } = get();
//     // Use orderId, not id
//     const order = orders.find((o) => o.orderId === id || o.orderNumber === id);
//     if (!order) {
//       toast.error("Order not found");
//       return null;
//     }
//     return order;
//   },

//   // Update order status
//   updateOrderStatus: async (id, status) => {
//     try {
//       await fetch(`/api/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status }),
//       });

//       set((state) => ({
//         orders: state.orders.map((o) => (o.orderId === id ? { ...o, status } : o)),
//         recentOrder:
//           state.recentOrder && state.recentOrder.orderId === id
//             ? { ...state.recentOrder, status }
//             : state.recentOrder,
//       }));

//       toast.success("Order status updated!");
//     } catch (error: any) {
//       console.error("Update order status failed:", error);
//       toast.error(error?.response?.data?.message || "Failed to update order");
//     }
//   },

//   // Fetch all orders (for admin view or customer order history)
//   fetchOrders: async () => {
//     try {
//       const res = await fetch("/api/orders");
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data: CustomerOrder[] = await res.json();
//       set({ orders: data });
//     } catch (error: any) {
//       console.error("Fetch orders failed:", error);
//       toast.error(error?.response?.data?.message || "Failed to fetch orders");
//     }
//   },
// }));


import { create } from "zustand";
import { toast } from "react-hot-toast";
import type { MenuItem } from "../types/menu";
import { createOrder } from "../api/orders";

export interface CustomerOrder {
  orderId: string;
  orderNumber: string;
  items: { menuItemId: string; quantity: number }[];
  totalAmount: number;
  finalAmount?: number;
  status: "pending" | "preparing" | "served" | "paid" | "cancelled";
  createdAt: string;
  tableCode?: string;
  customerType: "DINE-IN" | "WALK-IN" | "ONLINE";
  customerName?: string;
  mobileNumber?: string;
}

interface CustomerOrderStore {
  recentOrder: CustomerOrder | null;
  orders: CustomerOrder[];

  createOrder: (payload: {
    items: (MenuItem & { quantity: number })[];
    tableCode?: string;
    customerType: "DINE-IN" | "WALK-IN" | "ONLINE";
    customerName?: string;
    mobileNumber?: string;
  }) => Promise<CustomerOrder | null>;

  getOrderById: (id: string) => CustomerOrder | null;
  updateOrderStatus: (id: string, status: "pending" | "preparing" | "served" | "paid" | "cancelled") => Promise<void>;
  fetchOrders: () => Promise<void>;
}

export const useCustomerOrderStore = create<CustomerOrderStore>((set, get) => ({
  recentOrder: null,
  orders: [],

  createOrder: async ({ items, tableCode, customerType, customerName, mobileNumber }) => {
    try {
      if (!items || items.length === 0) {
        throw new Error("Cannot create order with empty cart");
      }

      const mappedItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));

      const newOrder = await createOrder({
        items: mappedItems,
        tableCode,
        customerType,
        customerName,
        mobileNumber
      });

      if (!newOrder) {
        throw new Error("Order creation failed - no response from server");
      }

      set({
        recentOrder: newOrder,
        orders: [...get().orders, newOrder]
      });

      toast.success("Order placed successfully!");
      console.log(newOrder)
      return newOrder;
    } catch (error: any) {
      console.error("Create order failed:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to create order";
      toast.error(errorMessage);
      return null;
    }
  },

  // ⭐ NEW FUNCTION: Update existing order with new items
  // updateExistingOrder: async (orderId, newItems) => {
  //   try {
  //     if (!newItems || newItems.length === 0) {
  //       throw new Error("No items to add");
  //     }

  //     const mappedItems = newItems.map(item => ({
  //       menuItemId: item.id,
  //       quantity: item.quantity
  //     }));

  //     const updatedOrder = await appendOrderItems(orderId, mappedItems);

  //     if (!updatedOrder) {
  //       throw new Error("Failed to update order");
  //     }

  //     // Update in local store
  //     set(state => ({
  //       orders: state.orders.map(o =>
  //         o.orderId === orderId ? updatedOrder : o
  //       ),
  //       recentOrder: updatedOrder
  //     }));

  //     return updatedOrder;
  //   } catch (error: any) {
  //     console.error("Update order failed:", error);
  //     const errorMessage = error?.response?.data?.message ||
  //       error?.message ||
  //       "Failed to update order";
  //     toast.error(errorMessage);
  //     return null;
  //   }
  // },

  getOrderById: (id: string) => {
    const { orders } = get();
    return orders.find((o) => o.orderId === id || o.orderNumber === id) || null;
  },

  updateOrderStatus: async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      set((state) => ({
        orders: state.orders.map((o) =>
          o.orderId === id ? { ...o, status } : o
        ),
        recentOrder:
          state.recentOrder && state.recentOrder.orderId === id
            ? { ...state.recentOrder, status }
            : state.recentOrder,
      }));

      toast.success("Order status updated!");
    } catch (error: any) {
      console.error("Update order status failed:", error);
      toast.error("Failed to update order");
    }
  },

  fetchOrders: async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: CustomerOrder[] = await res.json();
      set({ orders: data });
    } catch (error: any) {
      console.error("Fetch orders failed:", error);
      toast.error("Failed to fetch orders");
    }
  },
}));
