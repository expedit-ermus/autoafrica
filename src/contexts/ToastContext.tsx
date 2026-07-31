'use client';
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  exiting?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

const TOAST_DURATION = 4000;

const toastConfig = {
  success: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    border: 'from-emerald-500 to-green-500',
    bg: 'bg-white',
    iconBg: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-800',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    border: 'from-red-500 to-rose-500',
    bg: 'bg-white',
    iconBg: 'bg-red-100 text-red-600',
    text: 'text-red-800',
    progress: 'bg-red-500',
  },
  info: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    border: 'from-blue-500 to-indigo-500',
    bg: 'bg-white',
    iconBg: 'bg-blue-100 text-blue-600',
    text: 'text-blue-800',
    progress: 'bg-blue-500',
  },
  warning: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    border: 'from-orange-400 to-amber-500',
    bg: 'bg-white',
    iconBg: 'bg-orange-100 text-orange-600',
    text: 'text-orange-800',
    progress: 'bg-orange-500',
  },
} as const;

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = toastConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        group relative flex items-start gap-3 w-full sm:w-96
        ${config.bg}
        rounded-2xl shadow-xl shadow-black/8
        border border-gray-100
        overflow-hidden
        animate-[toastSlideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]
        cursor-pointer
        transition-all duration-300
        hover:shadow-2xl hover:scale-[1.02]
      `}
      onClick={() => onRemove(toast.id)}
    >
      {/* Gradient Left Border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.border}`} />

      {/* Icon */}
      <div className={`flex-shrink-0 ml-4 mt-4 w-8 h-8 rounded-xl ${config.iconBg} flex items-center justify-center`}>
        {config.icon}
      </div>

      {/* Message */}
      <div className="flex-1 py-4 pr-4">
        <p className={`text-sm font-semibold ${config.text} leading-snug`}>
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(toast.id); }}
        className="flex-shrink-0 mr-3 mt-4 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
        <div
          className={`h-full ${config.progress} rounded-full`}
          style={{
            animation: `toastProgress ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-3 max-sm:inset-x-4 max-sm:items-stretch max-sm:top-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              transition-all duration-300 ease-in-out
              ${t.exiting ? 'opacity-0 translate-x-4 sm:translate-x-4 -translate-y-2 sm:translate-y-0 scale-95' : 'opacity-100 translate-x-0 translate-y-0 scale-100'}
            `}
          >
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
