// ============================================
// ADMIN DASHBOARD VIEW
// ============================================

import {
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ToggleSideBar from "../../components/admin/ToggleSideBar";

// Dummy orders for demonstration
const DUMMY_ORDERS = [
  {
    id: 1001,
    tableNumber: "T3",
    customerName: "Rahul Shah",
    totalAmount: 1240,
    status: "completed",
  },
  {
    id: 1002,
    tableNumber: "C2",
    customerName: "Sneha Joshi",
    totalAmount: 685,
    status: "preparing",
  },
  {
    id: 1003,
    tableNumber: "O1",
    customerName: "Kabir Karki",
    totalAmount: 890,
    status: "cancelled",
  },
  {
    id: 1004,
    tableNumber: "T1",
    customerName: "Asmi Sharma",
    totalAmount: 1200,
    status: "completed",
  },
  {
    id: 1005,
    tableNumber: "C3",
    customerName: "Bikash Kunwar",
    totalAmount: 1550,
    status: "preparing",
  },
];

const AdminDashboardView = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Today's Revenue",
      value: "Rs. 45,650",
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Orders Today",
      value: "156",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Tables",
      value: "23",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Menu Items",
      value: "342",
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];  

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ToggleSideBar/>
            <h1 className="text-xl lg:text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              Welcome back, Admin!
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`${stat.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg lg:text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/admin/menu")}
                className="p-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
              >
                Manage Menu
              </button>
              <button
                onClick={() => navigate("/admin/orders")}
                className="p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/admin/inventory")}
                className="p-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Check Inventory
              </button>
              <button className="p-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                Generate Report
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg lg:text-xl font-bold">Recent Orders</h2>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {DUMMY_ORDERS.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        Order #{order.id}
                      </div>
                      <div className="text-sm text-gray-600">
                        Table {order.tableNumber} • {order.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      Rs. {order.totalAmount}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "preparing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardView;