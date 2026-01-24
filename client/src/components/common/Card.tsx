import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md p-6
        ${hover ? 'cursor-pointer hover:shadow-lg transition' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
