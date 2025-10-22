import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'elevated';
}

export const StatusCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  variant = 'default'
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border-slate-200 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg',
    elevated: 'bg-white border-slate-200 shadow-lg'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 cursor-pointer' 
    : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};