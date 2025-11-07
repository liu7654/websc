<template>
  <section v-if="productStore.current" class="detail">
    <div class="detail__media">
      <div
        class="detail__image"
        :style="{ backgroundImage: `url(${activeImage})`, backgroundPosition: zoomPosition }"
        @mousemove="handleZoom"
        @mouseleave="resetZoom"
      >
        <img :src="activeImage" :alt="productStore.current.name" />
      </div>
      <div class="detail__thumbnails">
        <button
          v-for="image in galleryImages"
          :key="image"
          :class="{ active: image === activeImage }"
          @click="() => (activeImage = image)"
        >
          <img :src="image" :alt="`${productStore.current.name} 预览`" />
        </button>
      </div>
    </div>
    <div class="detail__info">
      <p class="tag">库存 {{ productStore.current.stock }}</p>
      <h1>{{ productStore.current.name }}</h1>
      <p class="price">￥{{ productStore.current.price }}</p>
      <p class="desc">{{ productStore.current.description }}</p>

      <ul class="meta">
        <li><strong>分类：</strong>{{ productStore.current.categoryName }}</li>
        <li><strong>标签：</strong>{{ productStore.current.tags?.join(" / ") || "暂无" }}</li>
        <li><strong>评分：</strong>{{ productStore.current.rating || "4.5+" }}</li>
      </ul>

      <div class="detail__actions">
        <button @click="() => handleAddToCart(productStore.current)">加入购物车</button>
        <RouterLink class="ghost" to="/category">继续逛逛</RouterLink>
      </div>
    </div>
  </section>
  <section v-else class="empty">正在载入商品详情...</section>

  <section v-if="productStore.current" class="section detail__extra">
    <header class="section__header">
      <h3>商品说明</h3>
    </header>
    <div class="detail__panels">
      <article>
        <h4>图文介绍</h4>
        <p>
          本商品为 Web 商城示例数据，支持自定义属性、库存、打折信息以及多图展示。你可以在此模块添加更详细的卖点与售后政策。
        </p>
      </article>
      <article>
        <h4>配送与服务</h4>
        <ul>
          <li>全国包邮 · 极速发货</li>
          <li>7 天无理由退货 · 质量问题包退换</li>
          <li>支持开发票 · 售后在线答疑</li>
        </ul>
      </article>
    </div>
  </section>

  <section v-if="productStore.recommendations.length" class="section">
    <header class="section__header">
      <h3>同类推荐</h3>
    </header>
    <ProductList
      :products="productStore.recommendations"
      @add-to-cart="handleAddToCart"
    />
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useProductStore } from "@/store/product";
import { useCartStore } from "@/store/cart";
import ProductList from "@/components/ProductList.vue";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const activeImage = ref("");
const zoomPosition = ref("center");

const galleryImages = computed(() => {
  const product = productStore.current;
  if (!product) return [];
  if (Array.isArray(product.gallery) && product.gallery.length) {
    return product.gallery;
  }
  const base = product.cover;
  return Array.from({ length: 4 }, (_, index) => `${base}?variant=${index + 1}`);
});

const handleAddToCart = (payload) => {
  const product = payload || productStore.current;
  if (product) {
    cartStore.addItem(product, 1);
  }
};

const handleZoom = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  zoomPosition.value = `${x}% ${y}%`;
};

const resetZoom = () => {
  zoomPosition.value = "center";
};

watch(
  () => productStore.current,
  (product) => {
    if (product) {
      activeImage.value = galleryImages.value[0] || product.cover;
    }
  },
  { immediate: true }
);

watch(
  () => route.params.id,
  (id) => {
    if (!id) return;
    productStore.loadProduct(id);
    productStore.loadRecommendations({ productId: id });
  },
  { immediate: true }
);
</script>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.detail__media {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail__image {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background-size: 200%;
  background-repeat: no-repeat;
  transition: background-position 0.2s ease;
}

.detail__image img {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  display: block;
}

.detail__thumbnails {
  display: flex;
  gap: 12px;
}

.detail__thumbnails button {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 4px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.detail__thumbnails button.active {
  border-color: #7c3aed;
}

.detail__thumbnails img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}

.detail__info .desc {
  margin-bottom: 16px;
  color: #475569;
}

.detail__actions {
  display: flex;
  gap: 12px;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: #475569;
}

.meta li {
  margin-bottom: 6px;
}

.detail__extra .detail__panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.detail__extra article {
  background: #f9fafb;
  padding: 16px;
  border-radius: 16px;
}

.tag {
  color: #64748b;
}

.price {
  font-size: 32px;
  color: #ef4444;
}
</style>
