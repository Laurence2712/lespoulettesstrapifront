import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastExtra {
  image?: string;
  subtitle?: string;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  image?: string;
  subtitle?: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, extra?: ToastExtra) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const BG_COLORS: Record<ToastType, string> = {
  success: 'bg-gray-900 dark:bg-gray-800 text-white',
  error:   'bg-benin-rouge text-white',
  info:    'bg-benin-indigo text-white',
};

const PROGRESS_COLORS: Record<ToastType, string> = {
  success: 'bg-benin-jaune',
  error:   'bg-white/60',
  info:    'bg-white/60',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', extra?: ToastExtra) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, ...extra }]);
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
            className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 rounded-2xl shadow-2xl font-basecoat text-sm font-semibold max-w-[320px] sm:max-w-sm animate-slide-in-left ${BG_COLORS[toast.type]}`}
          >
            {/* Image preview (si présente) */}
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                className="w-14 h-14 object-cover flex-shrink-0 rounded-l-2xl"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-benin-jaune flex items-center justify-center flex-shrink-0 ml-4">
                <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
            )}

            <div className="py-3 pr-4 flex-1 min-w-0">
              <p className="leading-snug truncate">{toast.message}</p>
              {toast.subtitle && (
                <p className="text-xs text-white/70 mt-0.5 truncate">{toast.subtitle}</p>
              )}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 rounded-b-2xl overflow-hidden">
              <div className={`h-full ${PROGRESS_COLORS[toast.type]} toast-progress-bar`} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
