import React, { useState, useEffect } from 'react';
import { Percent, DollarSign } from 'lucide-react';

interface DiscountInputProps {
  orderTotal: number;
  onDiscountChange: (discount: { type: 'fixed' | 'percentage'; value: number; amount: number }) => void;
}

export const DiscountInput: React.FC<DiscountInputProps> = ({ orderTotal, onDiscountChange }) => {
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  useEffect(() => {
    let amount = 0;
    if (discountType === 'fixed') {
      amount = Math.min(discountValue, orderTotal);
    } else {
      amount = (orderTotal * discountValue) / 100;
    }
    setDiscountAmount(amount);
    onDiscountChange({ type: discountType, value: discountValue, amount });
  }, [discountType, discountValue, orderTotal]);

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-gray-800">Apply Discount</h3>
      
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setDiscountType('percentage')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
            discountType === 'percentage'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border-2 border-gray-300'
          }`}
        >
          <Percent className="w-4 h-4" />
          Percentage
        </button>
        <button
          onClick={() => setDiscountType('fixed')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
            discountType === 'fixed'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border-2 border-gray-300'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Fixed Amount
        </button>
      </div>

      {/* Value Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max={discountType === 'percentage' ? 100 : orderTotal}
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg font-bold text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
            {discountType === 'percentage' ? '%' : 'Rs.'}
          </span>
        </div>
      </div>

      {/* Discount Summary */}
      <div className="bg-white rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Original Total:</span>
          <span className="font-semibold">Rs. {orderTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount:</span>
          <span className="font-semibold text-green-600">- Rs. {discountAmount.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between">
          <span className="font-bold">Final Total:</span>
          <span className="font-bold text-xl text-indigo-600">
            Rs. {(orderTotal - discountAmount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
