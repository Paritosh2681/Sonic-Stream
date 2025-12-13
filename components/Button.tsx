import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variants = {
    // Reduced shadow opacity and spread
    primary: "bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-900/20 focus:ring-sky-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-slate-500",
    outline: "border border-slate-700 hover:border-sky-500/50 text-slate-400 hover:text-sky-400 focus:ring-sky-500",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};