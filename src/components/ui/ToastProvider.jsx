import { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '380px',
          width: 'calc(100% - 3rem)',
          pointerEvents: 'none',
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--danger)' }} />,
    warning: <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />,
    info: <Info size={18} style={{ color: 'var(--primary)' }} />,
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="btn-icon"
        style={{ padding: '2px', color: 'var(--text-muted)' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default ToastProvider;
