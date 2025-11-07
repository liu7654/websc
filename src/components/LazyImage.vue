<template>
  <div class="lazy-image" :class="{ 'is-loaded': isLoaded, 'has-error': hasError }">
    <img
      v-if="!hasError"
      :src="currentSrc"
      :alt="alt"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-if="!isLoaded && !hasError" class="lazy-image__placeholder">
      <div class="lazy-image__spinner"></div>
    </div>
    <div v-if="hasError" class="lazy-image__error">
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p>图片加载失败</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ""
  },
  loading: {
    type: String,
    default: "lazy"
  },
  placeholder: {
    type: String,
    default: ""
  }
});

const currentSrc = ref(props.placeholder || props.src);
const isLoaded = ref(false);
const hasError = ref(false);

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  hasError.value = true;
};

onMounted(() => {
  if (props.placeholder && props.src !== props.placeholder) {
    // 先加载占位图，然后异步加载实际图片
    const img = new Image();
    img.onload = () => {
      currentSrc.value = props.src;
    };
    img.onerror = () => {
      hasError.value = true;
    };
    img.src = props.src;
  }
});
</script>

<style scoped>
.lazy-image {
  position: relative;
  overflow: hidden;
  background: #f3f4f6;
  width: 100%;
  height: 100%;
}

.lazy-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.lazy-image.is-loaded img {
  opacity: 1;
}

.lazy-image__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

.lazy-image__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #9ca3af;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.lazy-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f9fafb;
  color: #9ca3af;
}

.lazy-image__error svg {
  width: 48px;
  height: 48px;
}

.lazy-image__error p {
  margin: 0;
  font-size: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

