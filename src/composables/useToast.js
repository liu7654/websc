import { ref } from "vue";

const toasts = ref([]);
let toastId = 0;

export const useToast = () => {
  const show = (message, type = "success", duration = 2000) => {
    const id = toastId++;
    toasts.value.push({ id, message, type });
    
    setTimeout(() => {
      const index = toasts.value.findIndex(toast => toast.id === id);
      if (index !== -1) {
        toasts.value.splice(index, 1);
      }
    }, duration);
  };

  const success = (message) => show(message, "success");
  const error = (message) => show(message, "error");
  const info = (message) => show(message, "info");

  return {
    toasts,
    show,
    success,
    error,
    info
  };
};

