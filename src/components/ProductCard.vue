<template>
  <!-- 商品卡片：展示基础信息并提供快速加入购物车 -->
  <article class="card" :class="accentClass" tabindex="0">
    <RouterLink
      class="card__body"
      :to="{ name: 'productDetail', params: { id: product.id } }"
    >
      <div class="cover-wrapper">
        <LazyImage :src="product.cover" :alt="product.name" />
        <span class="chip">{{ product.categoryName }}</span>
      </div>
      <h3>{{ product.name }}</h3>
      <p class="desc">{{ product.description }}</p>
    </RouterLink>
    <footer>
      <div class="price-box">
        <strong>￥{{ product.price }}</strong>
        <span class="tag">库存 {{ product.stock }}</span>
      </div>
      <button
        class="add-btn"
        :class="{ 'is-adding': isAdding }"
        @click.stop="handleAdd"
      >
        <span>加入购物车</span>
        <span class="pulse" aria-hidden="true"></span>
      </button>
    </footer>
  </article>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import LazyImage from "./LazyImage.vue";

const emit = defineEmits(["add-to-cart"]);

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const isAdding = ref(false);
const palette = ["sunset", "mint", "ocean", "violet"];

const accentClass = computed(() => {
  const source = props.product.id || props.product.name || "";
  const hash = Array.from(source).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `card--${palette[hash % palette.length]}`;
});

const handleAdd = () => {
  if (isAdding.value) return;
  isAdding.value = true;
  emit("add-to-cart", props.product);
  setTimeout(() => {
    isAdding.value = false;
  }, 600);
};

</script>

<style scoped>
.card {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
  color: #0f172a;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
  z-index: 1;
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card--sunset {
  background: linear-gradient(135deg, rgba(255, 247, 237, 0.9), #fff);
}

.card--mint {
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.9), #fff);
}

.card--ocean {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.9), #fff);
}

.card--violet {
  background: linear-gradient(135deg, rgba(237, 233, 254, 0.9), #fff);
}

.card:focus-within,
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
}

.card:hover::after {
  opacity: 1;
}

.cover-wrapper {
  position: relative;
  height: 200px;
  border-radius: 18px;
  overflow: hidden;
}

.chip {
  position: absolute;
  left: 12px;
  top: 12px;
  background: rgba(15, 23, 42, 0.75);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
}

h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.desc {
  margin: 0;
  color: #64748b;
  min-height: 40px;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.price-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tag {
  font-size: 12px;
  color: #94a3b8;
}

.add-btn {
  position: relative;
  background: linear-gradient(135deg, #ff7a18, #ffb347);
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.add-btn .pulse {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.35);
  opacity: 0;
}

.add-btn.is-adding {
  animation: cart-pop 0.6s ease;
}

.add-btn.is-adding .pulse {
  animation: cart-pulse 0.6s ease;
}

@keyframes cart-pop {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes cart-pulse {
  0% {
    opacity: 0.8;
    transform: scale(0.6);
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}
</style>
