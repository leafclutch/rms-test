
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import OrdersExportPrint from "../../components/admin/OrdersExportPrint";
import ToggleSideBar from "../../components/admin/ToggleSideBar";
import ViewOrderDetailsModal from "../../components/admin/ViewOrderDetailsModal";
import { useOrderStore } from "../../store/useOrderStore";
import type { Order } from "../../types/order";

const AdminOrdersView = () => {
    const {
        fetchOrders,
        getFilteredOrders,
        selectedStatus,
        setSelectedStatus,
        setCurrentOrder,
        currentOrder,
        updateOrderStatus,
        initializeSocket,
        isLoading,
        error,
    } = useOrderStore();

    const orders = getFilteredOrders();

    useEffect(() => {
        fetchOrders();
        const cleanup = initializeSocket();
        return () => cleanup && cleanup();
    }, [fetchOrders, initializeSocket]);


    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ToggleSideBar />
                    <h1 className="text-xl lg:text-2xl font-bold">Orders Management</h1>
                </div>
                <button
                    onClick={() => fetchOrders()}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh orders"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-semibold">Error: {error}</p>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'pending', 'preparing', 'served', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${selectedStatus === status
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {status?.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Export / Print Buttons */}
                <OrdersExportPrint orders={orders} />

                {/* Loading State */}
                {isLoading && orders.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-2" />
                            <p className="text-gray-500">Loading orders...</p>
                        </div>
                    </div>
                )}

                {/* Orders Grid */}
                {!isLoading || orders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => {
                                // Safe fallback for order ID display
                                const tableInfo = order.table?.tableCode || order.tableNumber;
                                const displayId = order.orderNumber
                                    ? `Order #${order.orderNumber}`
                                    : order.id
                                        ? `Order #${order.id.slice(0, 8)}`
                                        : 'Order #N/A';

                                const headerText = tableInfo
                                    ? `[${tableInfo}] ${displayId}`
                                    : displayId;

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{headerText}</h3>
                                                {order.customerName && (
                                                    <p className="text-sm text-gray-600">{order.customerName}</p>
                                                )}
                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'served'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'preparing'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : order.status === 'cancelled'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {order?.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-gray-600">Total Amount:</span>
                                                <span className="font-bold text-xl">
                                                    Rs. {order.totalAmount || order.finalAmount || 0}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                                                    >
                                                        Start Preparing
                                                    </button>
                                                )}

                                                {order.status === 'preparing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'served')}
                                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                                                    >
                                                        Mark Served
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setCurrentOrder(order)}
                                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No orders found</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Orders will appear here when customers place them
                                </p>
                            </div>
                        )}
                    </div>
                ) : null}
            </main>

            {/* Order Details Modal */}
            <ViewOrderDetailsModal
                isOpen={!!currentOrder}
                order={currentOrder}
                onClose={() => setCurrentOrder(null)}
            />
        </div>
    );
};

export default AdminOrdersView;