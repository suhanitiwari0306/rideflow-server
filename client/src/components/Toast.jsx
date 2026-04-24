import { useEffect } from 'react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const icon = toast.type === 'success' ? '✓' : '✕';

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{icon}</span>
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
