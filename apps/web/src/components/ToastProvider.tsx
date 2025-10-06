import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast: (message, type = 'info') => {
        const toast = { id: createId(), message, type };
        setToasts((current) => [...current, toast]);
        setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== toast.id));
        }, 5000);
      },
      dismissToast: (id) => setToasts((current) => current.filter((item) => item.id !== id))
    }),
    [toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={
              'flex max-w-xs items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900'
            }
          >
            <span className="font-semibold text-slate-700 dark:text-slate-100">
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}
            </span>
            <p className="text-slate-700 dark:text-slate-100">{toast.message}</p>
            <button
              onClick={() => value.dismissToast(toast.id)}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast s\'ha d\'utilitzar dins de ToastProvider');
  }
  return context;
}
