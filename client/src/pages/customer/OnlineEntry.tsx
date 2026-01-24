import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, ArrowRight } from 'lucide-react';

const OnlineEntry: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Basic phone validation (optional, can be stricter)
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // Redirect to menu with query params
    const params = new URLSearchParams({
      name: name.trim(),
      phone: phone.trim()
    });
    
    navigate(`/menu?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mt-2">
            Please enter your details to start ordering
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nishan Dhakal"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16516f] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9800000000"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16516f] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#16516f] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#11425c] transition-colors flex items-center justify-center gap-2"
          >
            <span>Start Ordering</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center">
        Powered by Leafclutch Technologies
      </p>
    </div>
  );
};

export default OnlineEntry;
