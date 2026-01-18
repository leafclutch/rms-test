import React, { useState } from 'react';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Customer } from '../../../types/Customer';
import { useCreditStore } from '../../../store/useCreditStore';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

interface AddDebtModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const AddDebtModal: React.FC<AddDebtModalProps> = ({ customer, isOpen, onClose }) => {
  const { addCreditTransaction } = useCreditStore();
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCredit = customer.creditLimit - customer.totalCredit;
  const newTotal = customer.totalCredit + amount;
  const exceedsLimit = newTotal > customer.creditLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (exceedsLimit) {
      toast.error('Amount exceeds customer credit limit');
      return;
    }

    setIsSubmitting(true);

    try {
      addCreditTransaction(customer.id, {
        customerId: customer.id,
        type: 'debt',
        amount: amount,
        notes: notes.trim() || `Manual debt entry - ${new Date().toLocaleDateString()}`
      });

      toast.success(`Rs. ${amount} added to ${customer.name}'s account`);
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add debt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount(0);
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Debt to Account"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Customer</p>
          <p className="text-xl font-bold text-gray-900">{customer.name}</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Outstanding:</p>
              <p className="font-bold text-red-600">Rs. {customer.totalCredit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Available Credit:</p>
              <p className="font-bold text-green-600">Rs. {availableCredit.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <Input
          type="number"
          label="Debt Amount (Rs.) *"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          icon={<DollarSign className="w-5 h-5" />}
          // Removing unsupported props 'min' and 'max'
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for debt addition..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        {/* Preview */}
        {amount > 0 && (
          <div className={`rounded-xl p-4 border-2 ${
            exceedsLimit 
              ? 'bg-red-50 border-red-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${
                exceedsLimit ? 'text-red-600' : 'text-blue-600'
              }`} />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">
                  {exceedsLimit ? 'Credit Limit Exceeded!' : 'Transaction Preview'}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adding Amount:</span>
                    <span className="font-bold">Rs. {amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Outstanding:</span>
                    <span className={`font-bold ${exceedsLimit ? 'text-red-600' : 'text-gray-900'}`}>
                      Rs. {newTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Limit:</span>
                    <span className="font-bold text-gray-900">
                      Rs. {customer.creditLimit.toLocaleString()}
                    </span>
                  </div>
                  {!exceedsLimit && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Remaining Credit:</span>
                      <span className="font-bold text-green-600">
                        Rs. {(customer.creditLimit - newTotal).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting || amount <= 0 || exceedsLimit}
          >
            {isSubmitting ? 'Adding Debt...' : `Add Rs. ${amount.toLocaleString()}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};