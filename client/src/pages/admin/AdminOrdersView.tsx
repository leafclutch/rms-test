
import { useEffect, useState } from "react";
import { RefreshCw, Search, History, ListFilter } from "lucide-react";
import OrdersExportPrint from "../../components/admin/OrdersExportPrint";
import ToggleSideBar from "../../components/admin/ToggleSideBar";
import ViewOrderDetailsModal from "../../components/admin/ViewOrderDetailsModal";
import { useOrderStore } from "../../store/useOrderStore";

const AdminOrdersView = () => {
    const {
        fetchOrders,
        fetchHistory,
        getFilteredOrders,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        setCurrentOrder,
        currentOrder,
        updateOrderStatus,
        initializeSocket,
        isLoading,
        error,
        isHistoryMode,
        setIsHistoryMode,
        historyOrders,
    } = useOrderStore();

    const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [filterTable, setFilterTable] = useState<string>('all');

    const orders = getFilteredOrders();

    // Advanced Filtering for Display
    const displayedOrders = orders.filter(order => {
        // Date Filter (Compare YYYY-MM-DD)
        const orderDate = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];
        const matchesDate = !filterDate || orderDate === filterDate;

        // Table Filter
        const tableCode = order.table?.tableCode || order.tableNumber || "";
        const matchesTable = filterTable === 'all' || tableCode === filterTable;

        return matchesDate && matchesTable;
    });

    // Calculate Sales Summary (Always from History/Paid Orders for selected date, IGNORING table filter)
    const ordersForSummary = (historyOrders || []).filter(order => {
        const orderDate = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];
        const matchesDate = !filterDate || orderDate === filterDate;
        return matchesDate;
    });

    useEffect(() => {
        // Always fetch history initially to populate sales stats
        fetchHistory().catch(console.error);
        if (!isHistoryMode) fetchOrders();

        const cleanup = initializeSocket();
        return () => cleanup && cleanup();
    }, [fetchOrders, fetchHistory, initializeSocket, isHistoryMode]);

    // Sales Summary Calculation
    const salesSummary = ordersForSummary.reduce((acc, order) => {
        const total = Number(order.totalAmount || 0);
        acc.total += total;

        const method = order.paymentMethod;
        if (method === 'CASH') acc.cash += total;
        else if (method === 'ONLINE') acc.online += total;
        else if (method === 'CREDIT') acc.credit += total;
        else if (method === 'MIXED') {
            acc.cash += Number(order.cashAmount || 0);
            acc.online += Number(order.onlineAmount || 0);
        }
        return acc;
    }, { total: 0, cash: 0, online: 0, credit: 0 });




    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ToggleSideBar />
                    <h1 className="text-xl lg:text-2xl font-bold">
                        {isHistoryMode ? 'Order History' : 'Orders Management'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsHistoryMode(!isHistoryMode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${isHistoryMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {isHistoryMode ? <ListFilter className="w-4 h-4" /> : <History className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isHistoryMode ? 'Active Orders' : 'Order History'}</span>
                    </button>
                    <button
                        onClick={() => isHistoryMode ? fetchHistory() : fetchOrders()}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Refresh orders"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">{isLoading ? 'Loading...' : 'Refresh'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                        <p className="text-red-800 font-semibold text-sm">Error: {error}</p>
                    </div>
                )}

                {/* Filters and Sales Summary */}
                <div className="flex flex-col gap-6 mb-6">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Date Filter */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            {/* Status Filter */}
                            {!isHistoryMode && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="served">Served</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}

                            {/* Table Filter */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Table No</label>
                                <select
                                    value={filterTable}
                                    onChange={(e) => setFilterTable(e.target.value)}
                                    className="w-full md:w-40 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                                >
                                    <option value="all">All Tables</option>
                                    {Array.from(new Set(orders.map(o => o.tableNumber || o.table?.tableCode).filter(Boolean)))
                                        .sort()
                                        .map(code => {
                                            const order = orders.find(o => (o.tableNumber || o.table?.tableCode) === code);
                                            let label = String(code);
                                            if (String(code).startsWith("WALKIN") && order) {
                                                const identifier = order.customerName || order.customerPhone;
                                                label = identifier ? `${identifier} (Walk-in)` : "Walk-in";
                                            }
                                            return <option key={String(code)} value={String(code)}>{label}</option>;
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        {/* Search and Export */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>
                            <OrdersExportPrint orders={displayedOrders} />
                        </div>
                    </div>

                    {/* Sales Summary */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Total Sales (Paid Orders):
                            <span className="text-emerald-600 ml-2">Rs. {salesSummary.total.toFixed(2)}</span>
                        </h3>
                        <div className="text-sm text-gray-600 flex gap-4">
                            <span>Cash: <span className="font-semibold">Rs. {salesSummary.cash.toFixed(2)}</span></span>
                            <span className="text-gray-300">|</span>
                            <span>Online: <span className="font-semibold">Rs. {salesSummary.online.toFixed(2)}</span></span>
                            <span className="text-gray-300">|</span>
                            <span>Credit: <span className="font-semibold">Rs. {salesSummary.credit.toFixed(2)}</span></span>
                        </div>
                    </div>
                </div>

                {/* OrdersExportPrint moved to header */}


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
                {!isLoading || displayedOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {displayedOrders && displayedOrders.length > 0 ? (
                            displayedOrders.map((order) => {
                                const tableCode = order.table?.tableCode || order.tableNumber || "";
                                const isWalkIn = tableCode.startsWith("WALKIN");

                                // Header: Use customer name for walk-in, table code for others
                                const headerText = isWalkIn
                                    ? (order.customerName || "Walk-in")
                                    : tableCode;

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{headerText}</h3>
                                                {!isWalkIn && order.customerName && (
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