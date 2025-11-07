<template>
  <div v-if="loading" class="grid">
    <SkeletonCard v-for="i in skeletonCount" :key="`skeleton-${i}`" />
  </div>
  <div v-else-if="!products.length" class="empty">
    <svg
      class="empty__icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <p>{{ emptyText }}</p>
  </div>
  <div v-else class="grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="$emit('add-to-cart', product)"
    />
  </div>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import SkeletonCard from "./SkeletonCard.vue";

// 商品列表组件：统一处理加载态、空态与网格样式
defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: "暂无商品"
  },
  skeletonCount: {
    type: Number,
    default: 6
  }
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty {
  padding: 64px 32px;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty__icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
}

.empty p {
  margin: 0;
  font-size: 16px;
}
</style>
