
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
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/*
        Mobile: full-width sheet from bottom, no rounded corners, full height on tiny screens.
        Desktop (≥ sm): centred card with size cap.
      */}
      <div
        className={`
          bg-white w-full ${sizeStyles[size]}
          p-6 sm:p-12 space-y-6 sm:space-y-8
          animate-slideUp
          max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
          pb-[max(env(safe-area-inset-bottom),1.5rem)]
        `}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 sm:pb-6 sticky top-0 bg-white -mx-6 sm:mx-0 px-6 sm:px-0 pt-1">
            <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="text-gray-400 hover:text-black transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
            >
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
