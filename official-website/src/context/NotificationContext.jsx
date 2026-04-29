import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

const NotificationContext = createContext(null);
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to ExpensyPro!', message: 'Start by adding your first transaction.', time: 'Just now', read: false },
    { id: 2, title: 'Budget Tip', message: 'You spent 15% more on Food this week than last week.', time: '2h ago', read: false },
  ]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ showToast, notifications, markAsRead, clearAll }}>
      {children}
      
      {/* Toast Container */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`glass toast-${t.type}`}
              style={{
                padding: '12px 20px',
                minWidth: 280,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                borderLeft: `4px solid ${t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#6366f1'}`
              }}
            >
              {t.type === 'success' && <CheckCircle size={18} color="#10b981" />}
              {t.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
              {t.type === 'info' && <Info size={18} color="#6366f1" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
