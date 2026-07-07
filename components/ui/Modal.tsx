
import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${sizeStyles[size]} p-12 space-y-8 animate-slideUp max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-extrabold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
