import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditStore } from '../../store/useCreditStore';
import { Phone, CheckCircle } from 'lucide-react';
import type { Customer } from '../../types/Customer';

const AdminWalkInCustomer = () => {
  // `inputValue` can be either a name or a number (e.g. table number or customer name/phone)
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { customers, fetchCustomers } = useCreditStore();
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (inputValue.length >= 7) {
      const matched = customers.find((c: Customer) =>
        c.phone === inputValue ||
        c.phone.replace(/\D/g, '') === inputValue.replace(/\D/g, '')
      );
      setFoundCustomer(matched || null);
    } else {
      setFoundCustomer(null);
    }
  }, [inputValue, customers]);

  const handleCustomConfirm = () => {
    // If we found a customer, pass their name as well or use it
    const finalName = foundCustomer ? foundCustomer.name : inputValue;
    navigate(`/admin/walk-in-order?customer=${encodeURIComponent(finalName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">Walk-In-Order</h1>

          <div className="space-y-8 lg:space-y-10">
            <div className="border-2 border-green-500 rounded-xl p-6 lg:p-8 bg-green-50">
              <h3 className="text-green-700 font-semibold mb-4 text-base lg:text-lg">
                Customer Name / Phone (Optional)
              </h3>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter table number, name, or phone (e.g., 5, Ram, 98******)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  {foundCustomer && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border-2 border-green-500 rounded-lg shadow-lg z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Found: {foundCustomer.name}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {foundCustomer.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCustomConfirm}
                  disabled={!inputValue}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed h-fit"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInCustomer;
