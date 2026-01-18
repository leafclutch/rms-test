import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, Phone, History, AlertCircle, Wallet } from 'lucide-react';
import { useCreditStore } from '../../store/useCreditStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import SearchInput from '../../components/common/SearchInput';
import { AddCustomerModal } from '../../components/admin/AddCustomerModal';
import { toast } from 'react-hot-toast';

const CreditLedger: React.FC = () => {
  const navigate = useNavigate();
  const { customers, getTotalOutstanding, settleDebt, error, clearError } = useCreditStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [settlementAmount, setSettlementAmount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const totalOutstanding = getTotalOutstanding();

  const handleSettleDebt = () => {
    if (!selectedCustomer || settlementAmount <= 0) return;

    try {
      settleDebt(selectedCustomer, settlementAmount);
      toast.success('Debt settled successfully!');
      setSelectedCustomer(null);
      setSettlementAmount(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to settle debt');
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Ledger</h1>
          <p className="text-gray-600 mt-1">Manage customer credit accounts</p>
        </div>
        <Button 
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Customer
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-900 hover:text-red-700">
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600">Rs. {totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Near Limit</p>
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.totalCredit >= c.creditLimit * 0.8).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers by name or phone..."
        />
      </Card>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Add your first customer to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddModal(true)}>
                Add Customer
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} hover onClick={() => navigate(`/admin/customers/${customer.id}`)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{customer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </div>
                  </div>
                </div>
                {customer.totalCredit >= customer.creditLimit * 0.8 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    Near Limit
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                  <p className="text-xl font-bold text-red-600">Rs. {customer.totalCredit.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Credit Limit</p>
                  <p className="text-xl font-bold text-gray-800">Rs. {customer.creditLimit.toLocaleString()}</p>
                </div>
              </div>

              {/* Credit Usage Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Available: Rs. {(customer.creditLimit - customer.totalCredit).toLocaleString()}</span>
                  <span>{((customer.totalCredit / customer.creditLimit) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      customer.totalCredit >= customer.creditLimit * 0.8 ? 'bg-red-500' :
                      customer.totalCredit >= customer.creditLimit * 0.5 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((customer.totalCredit / customer.creditLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  fullWidth
                  variant="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(customer.id);
                    setSettlementAmount(customer.totalCredit);
                  }}
                  icon={<Wallet className="w-4 h-4" />}
                  disabled={customer.totalCredit === 0}
                >
                  Settle Debt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/customers/${customer.id}`);
                  }}
                  icon={<History className="w-4 h-4" />}
                >
                  History
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Settle Debt Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Settle Debt"
          size="sm"
        >
          {(() => {
            const customer = customers.find(c => c.id === selectedCustomer);
            if (!customer) return null;

            return (
              <div className="space-y-4">
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="text-xl font-bold">{customer.name}</p>
                  <p className="text-sm text-gray-600 mt-2">Outstanding Debt</p>
                  <p className="text-3xl font-bold text-red-600">Rs. {customer.totalCredit.toLocaleString()}</p>
                </div>

                <Input
                  type="number"
                  label="Settlement Amount"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(Number(e.target.value))}
                  max={customer.totalCredit}
                  min={1}
                  icon={<Wallet className="w-5 h-5" />}
                />

                {settlementAmount > 0 && settlementAmount <= customer.totalCredit && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Remaining after payment:</p>
                    <p className="text-xl font-bold text-green-600">
                      Rs. {(customer.totalCredit - settlementAmount).toLocaleString()}
                    </p>
                  </div>
                )}

                {settlementAmount > customer.totalCredit && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">
                      Amount exceeds outstanding debt
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={() => setSelectedCustomer(null)}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleSettleDebt}
                    disabled={settlementAmount <= 0 || settlementAmount > customer.totalCredit}
                  >
                    Confirm Payment
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

export default CreditLedger;