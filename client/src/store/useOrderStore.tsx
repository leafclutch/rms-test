import { create } from 'zustand';
import { createOrder, getOrders, preparingOrder, serveOrder, getOrderHistory } from '../api/orders';
import api from '../api/axios';
import { socket, connectSocket } from '../api/socket';
import toast from 'react-hot-toast';
import { Bell, CheckCircle, ClipboardCheck, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../types/order';

interface OrderStore {
    orders: Order[];
    historyOrders: Order[]; // Added historyOrders to keep them separate
    currentOrder: Order | null;
    selectedStatus: string;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
    isHistoryMode: boolean;
    historyCreditTransactions: any[];
    historyDebtSettlements: any[];

    fetchOrders: () => Promise<void>;
    fetchHistory: () => Promise<void>;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
    updateOrderItem: (orderId: string, menuItemId: string, action: 'increment' | 'decrement') => Promise<void>;
    setCurrentOrder: (order: Order | null) => void;
    setSelectedStatus: (status: string) => void;
    setSearchQuery: (query: string) => void;
    getFilteredOrders: () => Order[];
    getOrderById: (id: string) => Order | null;
    addOrder: (order: any) => Promise<void>;
    updateOrder: (orderId: string, updates: Partial<Order>) => void;
    initializeSocket: () => () => void;
    setIsHistoryMode: (isHistory: boolean) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    historyOrders: [],
    currentOrder: null,
    selectedStatus: 'all',
    searchQuery: '',
    isLoading: false,
    error: null,
    isHistoryMode: false,
    historyCreditTransactions: [],
    historyDebtSettlements: [],

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

    fetchHistory: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getOrderHistory();
            const historyWithDefaults = (data.orders || data || []).map((order: any) => ({
                ...order,
                id: order.id || order._id || `order-history-${Date.now()}`,
                status: 'paid',
                items: order.items || [],
                totalAmount: Number(order.totalAmount || order.finalAmount || 0),
                tableNumber: order.table?.tableCode || order.tableNumber || (order.tableCode ? order.tableCode : undefined)
            }));
            set({
                historyOrders: historyWithDefaults,
                historyCreditTransactions: data.creditTransactions || [],
                historyDebtSettlements: data.debtSettlements || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            set({ error: 'Failed to fetch order history', isLoading: false, historyOrders: [] });
        }
    },

    setIsHistoryMode: (isHistory: boolean) => {
        set({ isHistoryMode: isHistory, selectedStatus: 'all' });
        if (isHistory) {
            get().fetchHistory();
        } else {
            get().fetchOrders();
        }
    },

    addOrder: async (order: any) => {
        const payload = {
            customerType: "WALK_IN" as const,
            customerName: order.customerName,
            customerPhone: order.mobileNumber,
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
            toast.success("Order placed successfully!", {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });
        } catch (error: any) {
            toast.error(error?.message || "Failed to place order.");
            throw error;
        }
    },

    initializeSocket: () => {
        const { fetchOrders, fetchHistory } = get();

        // Connect with token if available
        const auth = localStorage.getItem("authUser");
        if (auth) {
            const { token } = JSON.parse(auth);
            connectSocket(token);
        }

        // Listen for new orders
        socket.on('order:new', (data) => {
            console.log('New order received via socket:', data);
            if (!get().isHistoryMode) fetchOrders();
            toast.success(`New order received for ${data.tableCode}!`, {
                icon: <Bell className="w-5 h-5 text-orange-500" />,
                duration: 5000
            });
        });

        // Listen for order updates
        socket.on('order:updated', (data) => {
            console.log('Order update received via socket:', data);
            if (get().isHistoryMode) fetchHistory();
            else fetchOrders();

            // Notify about added items
            if (data.addedItems && Array.isArray(data.addedItems)) {
                data.addedItems.forEach((item: { name: string; quantity: number }) => {
                    toast.success(`${item.name} is added on ${data.tableCode}`, {
                        icon: <Bell className="w-5 h-5 text-blue-500" />,
                        duration: 4000
                    });
                });
            }
        });

        // Listen for payments
        socket.on('order:paid', (data) => {
            console.log('Order payment received via socket:', data);
            fetchOrders();
            fetchHistory();
        });

        return () => {
            socket.off('order:new');
            socket.off('order:updated');
            socket.off('order:paid');
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

            toast.success(`Order marked as ${newStatus}`, {
                icon: <ClipboardCheck className="w-5 h-5 text-green-500" />
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            const msg = error instanceof Error ? error.message : 'Failed to update order';
            set({ error: msg });
            toast.error(msg, {
                icon: <XCircle className="w-5 h-5 text-red-500" />
            });
        }
    },

    cancelOrder: async (orderId: string) => {
        try {
            await api.patch(`/orders/${orderId}/cancel`);
            set(state => ({
                orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
            }));
            toast.success('Order cancelled successfully');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to cancel order');
        }
    },

    updateOrderItem: async (orderId: string, menuItemId: string, action: 'increment' | 'decrement') => {
        try {
            const response = await api.patch(`/orders/${orderId}/items/${menuItemId}`, { action });

            // Check if response contains the updated order and update local state
            if (response.data && response.data.order) {
                const updatedOrder = response.data.order;

                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === orderId ? { ...order, ...updatedOrder } : order
                    ),
                    // Also update currentOrder if it's the same one being viewed
                    currentOrder: state.currentOrder?.id === orderId
                        ? { ...state.currentOrder, ...updatedOrder }
                        : state.currentOrder
                }));
            } else {
                // Fallback if no order returned
                get().fetchOrders();
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update item quantity');
        }
    },

    setCurrentOrder: (order: Order | null) => {
        set({ currentOrder: order });
    },

    setSelectedStatus: (status: string) => {
        set({ selectedStatus: status });
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    getFilteredOrders: () => {
        const { orders, historyOrders, selectedStatus, searchQuery, isHistoryMode } = get();

        // Separate History (Paid) from Active Management
        let baseOrders = isHistoryMode ? historyOrders : orders;

        let filtered = baseOrders;

        // Filter by status tabs
        if (selectedStatus !== 'all' && !isHistoryMode) {
            filtered = filtered.filter((order) => order.status === selectedStatus);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((order) => {
                const tableCode = (order.table?.tableCode || order.tableNumber || "").toLowerCase();
                const customerName = (order.customerName || "").toLowerCase();
                const customerPhone = (order.customerPhone || "").toLowerCase();
                const orderNumber = (order.orderNumber || "").toLowerCase();

                return (
                    tableCode.includes(query) ||
                    customerName.includes(query) ||
                    customerPhone.includes(query) ||
                    orderNumber.includes(query)
                );
            });
        }

        return filtered;
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