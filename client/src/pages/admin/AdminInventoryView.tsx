// ============================================
// ADMIN INVENTORY VIEW
// ============================================

import { Plus, Package, Soup, Egg, Milk, Apple } from "lucide-react";
import ToggleSideBar from "../../components/admin/ToggleSideBar";

// Dummy data for inventory
const DUMMY_INVENTORY = [
  {
    id: 1,
    icon: <Package className="w-8 h-8 text-orange-500" />,
    name: "Rice",
    quantity: 70,
    unit: "kg",
    minStock: 20,
    status: "in-stock",
  },
  {
    id: 2,
    icon: <Soup className="w-8 h-8 text-red-500" />,
    name: "Cooking Oil",
    quantity: 10,
    unit: "liters",
    minStock: 15,
    status: "low-stock",
  },
  {
    id: 3,
    icon: <Egg className="w-8 h-8 text-yellow-500" />,
    name: "Eggs",
    quantity: 2,
    unit: "dozen",
    minStock: 5,
    status: "low-stock",
  },
  {
    id: 4,
    icon: <Milk className="w-8 h-8 text-blue-500" />,
    name: "Milk",
    quantity: 0,
    unit: "liters",
    minStock: 10,
    status: "out-of-stock",
  },
  {
    id: 5,
    icon: <Apple className="w-8 h-8 text-green-500" />,
    name: "Apple",
    quantity: 32,
    unit: "kg",
    minStock: 15,
    status: "in-stock",
  },
];

const AdminInventoryView = () => {
  // Sidebar completely removed except for import. No sidebar/open state, no sidebar button, no sidebar rendering.
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar intentionally omitted (except import) */}
      <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Sidebar open button removed */}
        <ToggleSideBar/>
        <h1 className="text-xl lg:text-2xl font-bold">Inventory Management</h1>
      </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Stock</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {DUMMY_INVENTORY.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{item.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'in-stock'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'low-stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status.toUpperCase().replace('-', ' ')}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-1">
                Stock: <span className="font-semibold">{item.quantity} {item.unit}</span>
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Min Stock: {item.minStock} {item.unit}
              </p>

              <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-all">
                Update Stock
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminInventoryView;