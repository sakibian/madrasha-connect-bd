
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
    {label && <label className="caps-label text-muted-foreground">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-4 bg-muted border border-input rounded-md outline-none focus:ring-2 focus:ring-ring font-bold transition-all ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-destructive font-medium">{error}</p>}
  </div>
));

export default Input;
