<template>
  <section class="section">
    <header class="section__header">
      <div>
        <h2>精选推荐</h2>
        <p>每次刷新都会为你推荐不同品类的爆款。</p>
      </div>
    </header>
    <ProductList
      :products="productStore.featured"
      :loading="featuredLoading && !productStore.featured.length"
      @add-to-cart="handleAddToCart"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useProductStore } from "@/store/product";
import { useCartStore } from "@/store/cart";
import ProductList from "@/components/ProductList.vue";

const productStore = useProductStore();
const cartStore = useCartStore();
const featuredLoading = ref(false);

const handleAddToCart = (product) => {
  cartStore.addItem(product, 1);
};

// 首屏加载精选商品
onMounted(async () => {
  featuredLoading.value = true;
  await productStore.loadFeaturedProducts();
  featuredLoading.value = false;
});
</script>

<style scoped>
.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
