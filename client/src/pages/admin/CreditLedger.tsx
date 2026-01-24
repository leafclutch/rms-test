import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, Phone, History, AlertCircle, Wallet, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [settlementAmount, setSettlementAmount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'settled' | 'customers'>('active');
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState<string[]>([]);
  
  const { 
    customers, 
    fetchCustomers, 
    fetchCustomerDetails,
    getTotalOutstanding, 
    settleDebt, 
    deleteCustomer,
    error, 
    clearError 
  } = useCreditStore();

  const toggleAccordion = async (customerId: string) => {
    if (expandedCustomers.includes(customerId)) {
      setExpandedCustomers(prev => prev.filter(id => id !== customerId));
    } else {
      setExpandedCustomers(prev => [...prev, customerId]);
      
      const customer = customers.find(c => c.id === customerId);
      if (customer && (!customer.creditHistory || customer.creditHistory.length === 0)) {
        setLoadingCustomers(prev => [...prev, customerId]);
        await fetchCustomerDetails(customerId);
        setLoadingCustomers(prev => prev.filter(id => id !== customerId));
      }
    }
  };

  // Fetch customers from database on mount
  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Auto-fill settlement amount when a customer is selected
  React.useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        setSettlementAmount(customer.totalCredit);
      }
    } else {
        setSettlementAmount(0);
    }
  }, [selectedCustomer, customers]);

  const filteredCustomers = customers.filter(c =>
    (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  const totalOutstanding = getTotalOutstanding();

  const activeCustomers = filteredCustomers.filter(c => c.totalCredit > 0);
  
  // Settled customers: Must have 0 credit AND have history (ledgerCount > 0 or local history > 0)
  // New customers (0 credit, 0 history) are excluded from this list.
  const settledCustomers = filteredCustomers
    .filter(c => c.totalCredit <= 0 && ((c.ledgerCount || 0) > 0 || (c.creditHistory && c.creditHistory.length > 0)))
    .sort((a, b) => {
      // Sort by updatedAt desc (most recent activity first)
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleDelete = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer account? This action cannot be undone.')) {
      try {
        await deleteCustomer(customerId);
      } catch (err) {
        // Error handled in store
      }
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Credit</p>
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
              <p className="text-sm text-gray-600">Total Credit Customers</p>
              <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Active Debts
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {activeCustomers.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('settled')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'settled'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Settled History
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {settledCustomers.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'customers'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Credit Customers
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {filteredCustomers.length}
            </span>
          </div>
        </button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${activeTab === 'active' ? 'active' : activeTab === 'settled' ? 'settled' : 'all'} customers by name or phone...`}
        />
      </Card>

      {/* Main Content Area */}
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
        <div className="space-y-6">
          {/* Active Accounts Section */}
          {activeTab === 'active' && activeCustomers.length > 0 && (
             <div>
               <div className="flex justify-end mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const allIds = activeCustomers.map(c => c.id);
                    const allExpanded = allIds.every(id => expandedCustomers.includes(id));
                    
                    if (allExpanded) {
                      setExpandedCustomers(prev => prev.filter(id => !allIds.includes(id)));
                    } else {
                      setExpandedCustomers(prev => [...new Set([...prev, ...allIds])]);
                      
                      // Identify customers needing data
                      const customersToFetch = activeCustomers.filter(c => 
                        !c.creditHistory || c.creditHistory.length === 0
                      );
                      
                      const idsToFetch = customersToFetch.map(c => c.id);
                      if (idsToFetch.length > 0) {
                        setLoadingCustomers(prev => [...prev, ...idsToFetch]);
                        await Promise.all(idsToFetch.map(id => fetchCustomerDetails(id)));
                        setLoadingCustomers(prev => prev.filter(id => !idsToFetch.includes(id)));
                      }
                    }
                  }}
                >
                  {activeCustomers.every(c => expandedCustomers.includes(c.id)) ? 'Collapse All' : 'Expand All'}
                </Button>
               </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                  {activeCustomers.map((customer) => {
                    const isExpanded = expandedCustomers.includes(customer.id);
                    const isCustomerLoading = loadingCustomers.includes(customer.id);

                    return (
                      <div key={customer.id} className="group">
                        <div className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}>
                          <button
                            onClick={() => toggleAccordion(customer.id)}
                            className="flex items-center gap-4 flex-1 text-left"
                          >
                            <div className={`p-2 rounded-full ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                {customer.phone}
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-4">
                            <div className="text-right mr-4">
                              <p className="text-xs text-gray-500">Outstanding</p>
                              <p className="text-lg font-bold text-red-600">Rs. {customer.totalCredit.toLocaleString()}</p>
                            </div>

                            <Button
                              size="sm"
                              variant="success"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomer(customer.id);
                                setSettlementAmount(customer.totalCredit);
                              }}
                              icon={<Wallet className="w-4 h-4" />}
                            >
                              Settle
                            </Button>

                            <button onClick={() => toggleAccordion(customer.id)}>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 bg-gray-50 border-t border-gray-100">
                            {isCustomerLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                              </div>
                            ) : customer.creditHistory && customer.creditHistory.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200 text-left text-gray-500">
                                      <th className="py-2 pl-2">Date</th>
                                      <th className="py-2">Item Details (Food Eaten)</th>
                                      <th className="py-2">Type</th>
                                      <th className="py-2 text-right pr-2">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {customer.creditHistory.map((txn) => (
                                      <tr key={txn.id} className="group/row hover:bg-gray-100">
                                        <td className="py-3 pl-2 text-gray-600 whitespace-nowrap align-top">
                                          {new Date(txn.timestamp).toLocaleDateString()}
                                          <br />
                                          <span className="text-xs text-gray-400">
                                            {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </td>
                                        <td className="py-3 text-gray-800 align-top">
                                          {txn.order ? (
                                            <div>
                                              <span className="font-medium text-indigo-600">Order #{txn.order.id.slice(0, 8)}</span>
                                              <ul className="mt-1 space-y-1 text-xs text-gray-600">
                                                {txn.order.items.map((item) => (
                                                  <li key={item.id} className="flex justify-between items-center max-w-[200px]">
                                                    <span>• {item.quantity}x {item.menuItem.name}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ) : (
                                            <span className="text-gray-600 italic">{txn.notes || 'No description'}</span>
                                          )}
                                        </td>
                                        <td className="py-3 align-top">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            txn.type === 'payment'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {txn.type === 'payment' ? 'Payment' : 'Debt'}
                                          </span>
                                        </td>
                                        <td className={`py-3 text-right pr-2 font-medium align-top ${
                                          txn.type === 'payment' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {txn.type === 'payment' ? '-' : '+'} Rs. {txn.amount.toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                No detailed history found.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
          )}

          {/* Settled Accounts Section */}
          {activeTab === 'settled' && settledCustomers.length > 0 && (
            <div>
              <div className="flex justify-end mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const allIds = settledCustomers.map(c => c.id);
                    const allExpanded = allIds.every(id => expandedCustomers.includes(id));
                    
                    if (allExpanded) {
                      setExpandedCustomers([]);
                    } else {
                      // Expand one by one to trigger fetches properly via existing logic or manually
                      // Better: Set all as expanded, then trigger fetches for those missing data
                      setExpandedCustomers(allIds);
                      
                      // Identify customers needing data
                      const customersToFetch = settledCustomers.filter(c => 
                        !c.creditHistory || c.creditHistory.length === 0
                      );
                      
                      // Set loading state for all of them
                      const idsToFetch = customersToFetch.map(c => c.id);
                      if (idsToFetch.length > 0) {
                        setLoadingCustomers(prev => [...prev, ...idsToFetch]);
                        
                        // Fetch in parallel
                        await Promise.all(idsToFetch.map(id => fetchCustomerDetails(id)));
                        
                        setLoadingCustomers(prev => prev.filter(id => !idsToFetch.includes(id)));
                      }
                    }
                  }}
                >
                  {settledCustomers.every(c => expandedCustomers.includes(c.id)) ? 'Collapse All' : 'Expand All'}
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {settledCustomers.map((customer) => {
                  const isExpanded = expandedCustomers.includes(customer.id);
                  const isCustomerLoading = loadingCustomers.includes(customer.id);

                  return (
                    <div key={customer.id} className="group">
                      <button
                        onClick={() => toggleAccordion(customer.id)}
                        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${isExpanded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                            Settled
                          </div>
                          
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          {isCustomerLoading ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                          ) : customer.creditHistory && customer.creditHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 text-left text-gray-500">
                                    <th className="py-2 pl-2">Date</th>
                                    <th className="py-2">Details</th>
                                    <th className="py-2">Type</th>
                                    <th className="py-2 text-right pr-2">Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {customer.creditHistory.map((txn) => (
                                    <tr key={txn.id} className="group/row hover:bg-gray-100">
                                      <td className="py-3 pl-2 text-gray-600 whitespace-nowrap align-top">
                                        {new Date(txn.timestamp).toLocaleDateString()}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                          {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </td>
                                      <td className="py-3 text-gray-800 align-top">
                                        {txn.order ? (
                                          <div>
                                            <span className="font-medium text-indigo-600">Order #{txn.order.id.slice(0, 8)}</span>
                                            <ul className="mt-1 space-y-1 text-xs text-gray-600">
                                              {txn.order.items.map((item) => (
                                                <li key={item.id} className="flex justify-between items-center max-w-[200px]">
                                                  <span>• {item.quantity}x {item.menuItem.name}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ) : (
                                          <span className="text-gray-600 italic">{txn.notes || 'No description'}</span>
                                        )}
                                      </td>
                                      <td className="py-3 align-top">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                          txn.type === 'payment'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {txn.type === 'payment' ? 'Payment' : 'Debt'}
                                        </span>
                                      </td>
                                      <td className={`py-3 text-right pr-2 font-medium align-top ${
                                        txn.type === 'payment' ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {txn.type === 'payment' ? '-' : '+'} Rs. {txn.amount.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No history found for this account.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty States for Tabs */}
          {activeTab === 'active' && activeCustomers.length === 0 && searchQuery === '' && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-full inline-flex mb-4 text-green-500 shadow-sm">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Debts!</h3>
              <p className="text-gray-600">
                Great job! All customer accounts are currently settled.
              </p>
            </div>
          )}

          {activeTab === 'settled' && settledCustomers.length === 0 && searchQuery === '' && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Settled History</h3>
              <p className="text-gray-600">
                Once customers settle their debts, they will appear here.
              </p>
            </div>
          )}

          {/* Credit Customers Management Section */}
          {activeTab === 'customers' && (
            <div key="customers-list">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCustomers
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically for management
                  .map((customer) => (
                    <Card key={customer.id} hover onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${
                             customer.totalCredit > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'
                          }`}>
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{customer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {customer.totalCredit === 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(customer.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                           )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                           customer.totalCredit > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {customer.totalCredit > 0 ? `Due: Rs. ${customer.totalCredit.toLocaleString()}` : 'Settled'}
                        </div>
                        <div className="text-xs text-gray-400">
                           Created: {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Card>
                ))}
              </div>
            </div>
          )}

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