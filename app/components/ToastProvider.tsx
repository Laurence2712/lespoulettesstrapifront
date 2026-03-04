import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <span className="w-7 h-7 rounded-full bg-benin-jaune flex items-center justify-center flex-shrink-0">
      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  ),
  error: (
    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  ),
  info: (
    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </span>
  ),
};

const PROGRESS_COLORS: Record<ToastType, string> = {
  success: 'bg-benin-jaune',
  error:   'bg-white/60',
  info:    'bg-white/60',
};

const BG_COLORS: Record<ToastType, string> = {
  success: 'bg-gray-900 dark:bg-gray-800 text-white',
  error:   'bg-benin-rouge text-white',
  info:    'bg-benin-indigo text-white',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-6 left-4 sm:left-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 pl-4 pr-5 pt-3 pb-4 rounded-2xl shadow-2xl font-basecoat text-sm sm:text-base font-semibold max-w-[320px] sm:max-w-sm animate-slide-in-left
              ${BG_COLORS[toast.type]}
            `}
          >
            {ICONS[toast.type]}
            <span className="leading-snug">{toast.message}</span>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 rounded-b-2xl overflow-hidden">
              <div
                className={`h-full ${PROGRESS_COLORS[toast.type]} toast-progress-bar`}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
