<template>
  <section class="section">
    <header class="section__header">
      <div>
        <h2>分类浏览</h2>
        <p>支持主/子类筛选与分页加载。</p>
      </div>
      <select v-model="selected">
        <option value="all">全部</option>
        <option
          v-for="category in productStore.categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </header>

    <ProductList
      :products="productStore.list"
      :loading="productStore.loading"
      empty-text="暂无商品"
      @add-to-cart="handleAddToCart"
    />

    <Pagination
      :page="productStore.pagination.page"
      :pages="pages"
      @change="handlePageChange"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/store/product";
import { useCartStore } from "@/store/cart";
import ProductList from "@/components/ProductList.vue";
import Pagination from "@/components/Pagination.vue";

const productStore = useProductStore();
const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();
const selected = ref(route.params.id || "all");

const pages = computed(() => {
  const { total, pageSize } = productStore.pagination;
  return Math.max(1, Math.ceil(total / pageSize));
});

const fetchProducts = (options = {}) => {
  productStore.loadProducts({
    categoryId: selected.value,
    page: options.page || 1
  });
};

watch(
  () => route.params.id,
  (value) => {
    selected.value = value || "all";
    fetchProducts();
  },
  { immediate: true }
);

watch(selected, (value) => {
  router.replace({ name: "category", params: { id: value === "all" ? undefined : value } });
});

const handlePageChange = (page) => {
  fetchProducts({ page });
};

const handleAddToCart = (product) => cartStore.addItem(product, 1);
</script>

<style scoped>
.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

select {
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
}
</style>
