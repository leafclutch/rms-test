import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'outline' | 'success';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
};

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  success: 'bg-green-600 text-white hover:bg-green-700',
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  fullWidth,
  loading,
  disabled,
  icon,
  size = 'md',
  variant = 'primary',
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

export default Button;
