import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
  colorClass?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  colorClass = 'border-blue-500',
  className = 'my-4'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
  };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClass}`}></div>
    </div>
  );
};