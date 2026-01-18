import React, { useState } from 'react';
import { User, Phone, Mail, CreditCard, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCreditStore } from '../../store/useCreditStore';
import { toast } from 'react-hot-toast';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper component to render validation error messages below input fields
const InputError = ({ error }: { error?: string }) =>
  error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null;

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer } = useCreditStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    creditLimit: 5000
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Credit limit validation
    if (formData.creditLimit <= 0) {
      newErrors.creditLimit = 'Credit limit must be greater than 0';
    } else if (formData.creditLimit > 100000) {
      newErrors.creditLimit = 'Credit limit cannot exceed Rs. 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        email: formData.email.trim() || undefined,
        creditLimit: formData.creditLimit
      });

      toast.success('Customer added successfully!');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      creditLimit: 5000
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Customer"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Input
            label="Customer Name *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            icon={<User className="w-5 h-5" />}
            required
          />
          <InputError error={errors.name} />
        </div>

        {/* Phone */}
        <div>
          <Input
            label="Phone Number *"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="9841234567"
            icon={<Phone className="w-5 h-5" />}
            maxLength={10}
            required
          />
          <InputError error={errors.phone} />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email (Optional)"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="customer@example.com"
            icon={<Mail className="w-5 h-5" />}
          />
          <InputError error={errors.email} />
        </div>

        {/* Credit Limit */}
        <div>
          <Input
            label="Credit Limit (Rs.) *"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
            placeholder="5000"
            icon={<CreditCard className="w-5 h-5" />}
            min={1000}
            max={100000}
            step={500}
            required
          />
          <InputError error={errors.creditLimit} />
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <p className="font-semibold mb-1">Credit Limit Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>New customers: Rs. 5,000 - 10,000</li>
                  <li>Regular customers: Rs. 10,000 - 25,000</li>
                  <li>VIP customers: Rs. 25,000 - 50,000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
          <h4 className="font-bold text-gray-800 mb-2">Customer Summary</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {formData.name || '---'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {formData.phone || '---'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {formData.email || 'Not provided'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Credit Limit:</span> Rs. {formData.creditLimit.toLocaleString()}
            </p>
          </div>
        </div>

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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};