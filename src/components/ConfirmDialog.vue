<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="dialog-overlay" @click="handleCancel">
        <div class="dialog" @click.stop>
          <div class="dialog__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="dialog__title">{{ title }}</h3>
          <p class="dialog__message">{{ message }}</p>
          <div class="dialog__actions">
            <button class="dialog__btn dialog__btn--cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="dialog__btn dialog__btn--confirm" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "确认操作"
  },
  message: {
    type: String,
    default: "确定要继续吗？"
  },
  confirmText: {
    type: String,
    default: "确定"
  },
  cancelText: {
    type: String,
    default: "取消"
  }
});

const emit = defineEmits(["confirm", "cancel"]);
const visible = ref(false);

const show = () => {
  visible.value = true;
};

const hide = () => {
  visible.value = false;
};

const handleConfirm = () => {
  emit("confirm");
  hide();
};

const handleCancel = () => {
  emit("cancel");
  hide();
};

defineExpose({ show, hide });
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.dialog {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.dialog__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog__icon svg {
  width: 36px;
  height: 36px;
  color: #ef4444;
}

.dialog__title {
  margin: 0 0 12px 0;
  font-size: 22px;
  color: #0f172a;
}

.dialog__message {
  margin: 0 0 24px 0;
  color: #64748b;
  line-height: 1.6;
}

.dialog__actions {
  display: flex;
  gap: 12px;
}

.dialog__btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog__btn--cancel {
  background: #f1f5f9;
  color: #64748b;
}

.dialog__btn--cancel:hover {
  background: #e2e8f0;
}

.dialog__btn--confirm {
  background: #ef4444;
  color: #fff;
}

.dialog__btn--confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-active .dialog,
.dialog-leave-active .dialog {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog,
.dialog-leave-to .dialog {
  transform: scale(0.9) translateY(-20px);
}
</style>

