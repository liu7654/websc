<template>
  <section class="section">
    <header class="section__header">
      <h2>搜索商品</h2>
      <input v-model="keyword" placeholder="输入商品名称或描述" />
    </header>

    <ProductList
      :products="productStore.list"
      :loading="productStore.loading"
      empty-text="暂无匹配商品"
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
import { debounce } from "@/composables/useDebounce";
import ProductList from "@/components/ProductList.vue";
import Pagination from "@/components/Pagination.vue";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const keyword = ref(route.query.q || "");

const pages = computed(() => {
  const { total, pageSize } = productStore.pagination;
  return Math.max(1, Math.ceil(total / pageSize));
});

const fetchProducts = (options = {}) => {
  productStore.loadProducts({
    keyword: keyword.value,
    page: options.page || 1
  });
};

// 防抖搜索函数
const debouncedSearch = debounce((value) => {
  router.replace({ name: "search", query: { q: value || undefined } });
}, 500);

watch(
  () => route.query.q,
  (value) => {
    keyword.value = value || "";
    fetchProducts();
  },
  { immediate: true }
);

watch(keyword, (value) => {
  debouncedSearch(value);
});

const handlePageChange = (page) => {
  fetchProducts({ page });
};

const handleAddToCart = (product) => cartStore.addItem(product, 1);
</script>

<style scoped>
.section__header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.section__header h2 {
  min-width: 120px;
}

input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #fff;
}

input:focus {
  outline: none;
  border-color: #ff7a18;
  box-shadow: 0 0 0 3px rgba(255, 122, 24, 0.1);
}

input::placeholder {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .section__header {
    flex-direction: column;
    align-items: stretch;
  }

  .section__header h2 {
    min-width: auto;
  }
}
</style>
