import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`border-t-indigo-600 border-b-indigo-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin ${sizeClasses[size]}`}
      ></div>
      {text && <span className="text-gray-600 text-sm font-medium">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
