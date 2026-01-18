// ============================================
// TABLE SELECTION VIEW
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminWalkInCustomer = () => {
  // `inputValue` can be either a name or a number (e.g. table number or customer name/phone)
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleCustomConfirm = () => {
    // Pass the value as a query parameter (represents name or number)
    navigate(`/admin/walk-in-order?customer=${encodeURIComponent(inputValue)}`);
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
                <input
                  type="text"
                  placeholder="Enter table number, name, or phone (e.g., 5, Ram, 98******)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button
                  onClick={handleCustomConfirm}
                  disabled={!inputValue}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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