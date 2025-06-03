import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow p-6 ${hoverable ? 'transition-shadow duration-200 hover:shadow-xl cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card; 