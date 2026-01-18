import { create } from 'zustand';
import { createOrder, getOrders, preparingOrder, serveOrder } from '../api/orders';
import api from '../api/axios';
import { socket } from '../api/socket';
import toast from 'react-hot-toast';
import type { Order, OrderStatus } from '../types/order';

interface OrderStore {
    orders: Order[];
    currentOrder: Order | null;
    selectedStatus: string;
    isLoading: boolean;
    error: string | null;

    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
    setCurrentOrder: (order: Order | null) => void;
    setSelectedStatus: (status: string) => void;
    getFilteredOrders: () => Order[];
    getOrderById: (id: string) => Order | null;
    addOrder: (order: any) => Promise<void>;
    updateOrder: (orderId: string, updates: Partial<Order>) => void;
    initializeSocket: () => () => void;
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

            const ordersWithDefaults = (data.orders || data || []).map((order: any) => ({
                ...order,
                id: order.id || order._id || `order-${Date.now()}-${Math.random()}`,
                status: order.status || 'pending',
                items: order.items || [],
                totalAmount: Number(order.totalAmount || order.finalAmount || 0),
                tableNumber: order.table?.tableCode || order.tableNumber || (order.tableCode ? order.tableCode : undefined)
            }));

            set({ orders: ordersWithDefaults, isLoading: false });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch orders',
                isLoading: false,
                orders: []
            });
        }
    },

    addOrder: async (order: any) => {
        const payload = {
            customerType: "WALK_IN" as const,
            customerName: order.customerName,
            items: order.items.map((item: any) => ({
                menuItemId: item?.id,
                quantity: item.quantity ?? 1,
            })),
        };

        try {
            const response = await createOrder(payload);
            const newOrder = response.order || response;

            // Map the new order to match the store's expected format
            const mappedOrder = {
                ...newOrder,
                tableNumber: newOrder.table?.tableCode || newOrder.tableNumber || "WALK_IN"
            };

            set((state) => ({
                orders: [mappedOrder, ...state.orders]
            }));
            toast.success("Order placed successfully!");
        } catch (error: any) {
            toast.error(error?.message || "Failed to place order.");
            throw error;
        }
    },

    initializeSocket: () => {
        const { fetchOrders } = get();

        // Listen for new orders
        socket.on('order:new', (data) => {
            console.log('New order received via socket:', data);
            fetchOrders(); // Refresh all orders to ensure consistent state
            toast('New Order Received!', { icon: '🔔' });
        });

        // Listen for order updates
        socket.on('order:updated', (data) => {
            console.log('Order update received via socket:', data);
            fetchOrders();
            toast('Order Updated', { icon: '📝' });
        });

        return () => {
            socket.off('order:new');
            socket.off('order:updated');
        };
    },

    updateOrderStatus: async (orderId: string, newStatus: OrderStatus) => {
        try {
            if (newStatus === 'preparing') {
                await preparingOrder(orderId);
            } else if (newStatus === 'served') {
                await serveOrder(orderId);
            } else {
                const response = await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
                if (response.status !== 200) throw new Error('Failed to update order status');
            }

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
        if (selectedStatus === 'all') return orders;
        return orders.filter((order) => order.status === selectedStatus);
    },

    getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find((o) => o.id === id || o.orderNumber === id) || null;
    },

    updateOrder: (orderId: string, updates: Partial<Order>) => {
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, ...updates } : order
            ),
        }));
    }
}));