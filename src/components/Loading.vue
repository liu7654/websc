<template>
  <div class="loading" :class="{ 'loading--overlay': overlay }">
    <div class="spinner"></div>
    <p v-if="text" class="loading__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  overlay: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ""
  }
});
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
}

.loading--overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #ff7a18;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading__text {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

