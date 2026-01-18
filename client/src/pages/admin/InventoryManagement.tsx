import React, { useState } from 'react';
import { Edit2, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const InventoryManagement: React.FC = () => {
  const { items, updateStock, getLowStockItems, getOutOfStockItems } = useInventoryStore();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState(0);

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  const handleUpdateStock = (itemId: string) => {
    updateStock(itemId, newQuantity);
    setEditingItem(null);
    setNewQuantity(0);
  };

  const getStatusColor = (status: string) => {
    return status === 'in-stock' ? 'bg-green-100 text-green-800' :
           status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800';
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Track and manage your stock levels</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {outOfStockItems.length > 0 && (
          <Card className="border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems.length} items</p>
              </div>
            </div>
          </Card>
        )}

        {lowStockItems.length > 0 && (
          <Card className="border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length} items</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{item.icon}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                {item.status.toUpperCase().replace('-', ' ')}
              </span>
            </div>

            <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Stock:</span>
                <span className="font-bold text-gray-900">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Stock:</span>
                <span className="font-semibold text-gray-700">{item.minStock} {item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost per unit:</span>
                <span className="font-semibold text-gray-700">Rs. {item.cost}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.status === 'in-stock' ? 'bg-green-500' :
                    item.status === 'low-stock' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((item.quantity / item.minStock) * 100, 100)}%` }}
                />
              </div>
            </div>

            <Button
              size="sm"
              fullWidth
              onClick={() => {
                setEditingItem(item.id);
                setNewQuantity(item.quantity);
              }}
              icon={<Edit2 className="w-4 h-4" />}
            >
              Update Stock
            </Button>
          </Card>
        ))}
      </div>

      {/* Update Stock Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Update Stock"
          size="sm"
        >
          {(() => {
            const item = items.find(i => i.id === editingItem);
            if (!item) return null;

            return (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Current: {item.quantity} {item.unit}</p>
                </div>

                <Input
                  type="number"
                  label="New Quantity"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  icon={<Package className="w-5 h-5" />}
                />

                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button fullWidth onClick={() => handleUpdateStock(item.id)}>
                    Update
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};

export default InventoryManagement;
