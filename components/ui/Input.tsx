
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => (
  <div className="space-y-2">
    {label && <label className="caps-label text-gray-400">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold transition-all ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
));

export default Input;
