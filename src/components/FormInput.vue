<template>
  <label class="form-input">
    <span class="form-input__label">{{ label }}</span>
    <div class="form-input__wrapper" :class="{ 'has-error': error, 'is-focused': isFocused }">
      <span v-if="icon" class="form-input__icon">{{ icon }}</span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
        @focus="isFocused = true"
      />
      <button
        v-if="type === 'password' && modelValue"
        type="button"
        class="form-input__toggle"
        @click="togglePassword"
      >
        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
      </button>
    </div>
    <Transition name="error">
      <span v-if="error" class="form-input__error">{{ error }}</span>
    </Transition>
    <span v-if="hint && !error" class="form-input__hint">{{ hint }}</span>
  </label>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "text"
  },
  placeholder: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  error: {
    type: String,
    default: ""
  },
  hint: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  validator: {
    type: Function,
    default: null
  }
});

const emit = defineEmits(["update:modelValue", "blur"]);

const isFocused = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  const input = event.target.closest('.form-input__wrapper').querySelector('input');
  input.type = showPassword.value ? 'text' : 'password';
};

const handleBlur = () => {
  isFocused.value = false;
  emit("blur");
};
</script>

<style scoped>
.form-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  font-weight: 500;
}

.form-input__label {
  margin-bottom: 8px;
  color: #0f172a;
  font-size: 14px;
}

.form-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  transition: all 0.2s ease;
  background: #fff;
}

.form-input__wrapper:hover {
  border-color: #cbd5e1;
}

.form-input__wrapper.is-focused {
  border-color: #ff7a18;
  box-shadow: 0 0 0 3px rgba(255, 122, 24, 0.1);
}

.form-input__wrapper.has-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input__wrapper.has-error.is-focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input__icon {
  margin-right: 10px;
  font-size: 18px;
  color: #94a3b8;
}

.form-input__wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #0f172a;
}

.form-input__wrapper input::placeholder {
  color: #94a3b8;
}

.form-input__wrapper input:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.form-input__toggle {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.form-input__toggle:hover {
  opacity: 1;
}

.form-input__error {
  margin-top: 6px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-input__error::before {
  content: "⚠️";
  font-size: 12px;
}

.form-input__hint {
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 400;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

