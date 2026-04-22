import { ToastConfig } from './types';
import { generateId } from './commonFunctions';

type ToastListener = (toast: ToastConfig) => void;
type DismissListener = (id: string) => void;

class ToastBus {
  private showListeners: ToastListener[] = [];
  private dismissListeners: DismissListener[] = [];

  onShow(listener: ToastListener) {
    this.showListeners.push(listener);
    return () => {
      this.showListeners = this.showListeners.filter(l => l !== listener);
    };
  }

  onDismiss(listener: DismissListener) {
    this.dismissListeners.push(listener);
    return () => {
      this.dismissListeners = this.dismissListeners.filter(l => l !== listener);
    };
  }

  show(config: Omit<ToastConfig, 'id'>) {
    const toast: ToastConfig = { id: generateId(), ...config };
    this.showListeners.forEach(l => l(toast));
    return toast.id;
  }

  dismiss(id: string) {
    this.dismissListeners.forEach(l => l(id));
  }
}

export const toastBus = new ToastBus();

const showSnackbar = {
  success: (message: string, duration = 3000) =>
    toastBus.show({ message, type: 'success', duration }),

  error: (message: string, duration = 4000) =>
    toastBus.show({ message, type: 'error', duration }),

  info: (message: string, duration = 3000) =>
    toastBus.show({ message, type: 'info', duration }),

  warning: (message: string, duration = 3500) =>
    toastBus.show({ message, type: 'warning', duration }),
};

export default showSnackbar;
