import { createContext } from 'react';

export const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {},
});

export default ToastContext;
