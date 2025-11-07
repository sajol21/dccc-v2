
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error') => void;
}

// FIX: Removed trailing comma not allowed.
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast: React.FC<{ message: ToastMessage; onRemove: (id: number) => void }> = ({ message, onRemove }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(message.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message.id, onRemove]);

  const bgColor = message.type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`px-4 py-2 text-white font-semibold rounded-md shadow-lg ${bgColor}`}
    >
      {message.message}
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-24 right-4 z-[9999] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};