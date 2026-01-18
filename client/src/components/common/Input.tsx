import React from 'react';

type InputProps = {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  max?: number;
  min?: number; // ✅ ADD THIS
};

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  max,
  min, // ✅ GET IT HERE
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          max={max}
          min={min} // ✅ PASS TO INPUT
          className={`
            w-full rounded-lg border border-gray-300
            px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${icon ? 'pl-10' : ''}
          `}
        />
      </div>
    </div>
  );
};

export default Input;
