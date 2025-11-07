import { ref, watch } from "vue";

export const useDebounce = (value, delay = 500) => {
  const debouncedValue = ref(value.value);
  let timeout = null;

  watch(value, (newValue) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
};

export const debounce = (fn, delay = 500) => {
  let timeout = null;

  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

