'use client';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'sm'
    ? 'sm:max-w-md'
    : size === 'lg'
      ? 'sm:max-w-4xl'
      : size === 'xl'
        ? 'sm:max-w-6xl'
        : 'sm:max-w-2xl';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-[backdropFadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`
          relative bg-white w-full ${sizeClass}
          max-h-[92vh] sm:max-h-[85vh]
          overflow-hidden flex flex-col
          rounded-t-3xl sm:rounded-3xl
          shadow-[0_-8px_40px_rgba(0,0,0,0.12)]
          max-sm:mx-0 max-sm:max-w-full
          sm:mx-4
          animate-[modalSlideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]
        `}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="
                w-9 h-9 rounded-xl flex items-center justify-center
                text-gray-400 hover:text-gray-700
                hover:bg-gray-100 active:scale-95
                transition-all duration-150
              "
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100/80 bg-gray-50/50 sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
