import { create } from 'zustand';
import { createOrder, getOrders, preparingOrder, serveOrder } from '../api/orders';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface menu {
    name: string;
    price: number;
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    menuItem: menu;
}

interface Order {
    id: string;
    orderNumber?: string;
    tableNumber?: string;
    customerName?: string;
    status: 'pending' | 'preparing' | 'served' | 'paid' | 'cancelled';
    totalAmount?: number;
    finalAmount?: number;
    items: OrderItem[];
    createdAt?: string;
    updatedAt?: string;
    paymentMethod?: 'cash' | 'online' | 'mixed' | 'credit';
    discountType?: 'percentage' | 'amount';
    discountValue?: number;
    finalAmountAfterDiscount?: number;
}

interface OrderStore {
    orders: Order[];
    currentOrder: Order | null;
    selectedStatus: string;
    isLoading: boolean;
    error: string | null;

    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
    setCurrentOrder: (order: Order | null) => void;
    setSelectedStatus: (status: string) => void;
    getFilteredOrders: () => Order[];
    getOrderById: (id: string) => Order | null;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    currentOrder: null,
    selectedStatus: 'all',
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {

            const data = await getOrders();

            // Ensure each order has required fields with fallbacks
            const ordersWithDefaults = (data.orders || data || []).map((order: any) => ({
                ...order,
                id: order.id || order._id || `order-${Date.now()}-${Math.random()}`,
                status: order.status || 'pending',
                items: order.items || [],
                totalAmount: order.totalAmount || order.finalAmount || 0,
            }));

            set({ orders: ordersWithDefaults, isLoading: false });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch orders',
                isLoading: false,
                orders: [] // Set empty array on error
            });
        }
    },

    addOrder: async (order: any) => {
        const payload = {
            customerType: "WALK-IN" as const,
            // Do not send tableCode for walk-in
            // The backend might expect customerName for walk-in, not tableCode
            tableCode: order.customerName, // Use customerName property for walk-in
            items: order.items.map((item: any) => ({
                menuItemId: item?.id,
                quantity: item.quantity ?? 1,
            })),
            // Optionally pass customerPhone, notes, etc. if you support them
        };
        console.log(payload)

        try {
            const createdOrder = await createOrder(payload);

            set((state) => ({
                orders: [createdOrder, ...state.orders]
            }));

            toast.success("Order placed successfully!");
        } catch (error: any) {
            toast.error(error?.message || "Failed to place order.");
            throw error;
        }
    },

    updateOrderStatus: async (orderId: string, newStatus: Order['status']) => {
        try {
            if (newStatus === 'preparing') {
                await preparingOrder(orderId);
            } else if (newStatus === 'served') {
                await serveOrder(orderId);
            } else {
                // Fallback for other statuses if needed
                const response = await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
                if (response.status !== 200) throw new Error('Failed to update order status');
            }

            // Optimistically update the UI
            set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ),
            }));

            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            const msg = error instanceof Error ? error.message : 'Failed to update order';
            set({ error: msg });
            toast.error(msg);
        }
    },

    setCurrentOrder: (order: Order | null) => {
        set({ currentOrder: order });
    },

    setSelectedStatus: (status: string) => {
        set({ selectedStatus: status });
    },

    getFilteredOrders: () => {
        const { orders, selectedStatus } = get();

        if (selectedStatus === 'all') {
            return orders;
        }

        return orders.filter((order) => order.status === selectedStatus);
    },

    getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find((o) => o.id === id || o.orderNumber === id) || null;
    }
}));