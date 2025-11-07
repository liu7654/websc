import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import {
  fetchProducts,
  fetchProductDetail,
  fetchRecommendations
} from "@/api/product";

// 商品仓库：统一负责商品列表、分类树、详情数据与推荐列表
export const useProductStore = defineStore("product", () => {
  const list = ref([]);
  const featured = ref([]);
  const categories = ref([]);
  const current = ref(null);
  const recommendations = ref([]);
  const loading = ref(false);
  const pagination = reactive({
    page: 1,
    pageSize: 12,
    total: 0
  });
  const filters = reactive({
    categoryId: "all",
    keyword: "",
    sort: "default"
  });

  const applyFilters = (payload = {}) => {
    if (payload.categoryId !== undefined) filters.categoryId = payload.categoryId;
    if (payload.keyword !== undefined) filters.keyword = payload.keyword;
    if (payload.sort !== undefined) filters.sort = payload.sort;
    if (payload.pageSize !== undefined) pagination.pageSize = payload.pageSize;
    if (payload.page !== undefined) pagination.page = payload.page;
  };

  const loadProducts = async (params = {}) => {
    loading.value = true;
    try {
      applyFilters(params);
      const response = await fetchProducts({
        categoryId: filters.categoryId,
        keyword: filters.keyword,
        sort: filters.sort,
        page: pagination.page,
        pageSize: pagination.pageSize
      });
      list.value = response.items;
      categories.value = response.categoryTree;
      pagination.page = response.page;
      pagination.pageSize = response.pageSize;
      pagination.total = response.total;
      return response;
    } finally {
      loading.value = false;
    }
  };

  const loadFeaturedProducts = async () => {
    const response = await fetchProducts({ pageSize: 8 });
    featured.value = response.items;
  };

  const loadProduct = async (id) => {
    loading.value = true;
    try {
      current.value = await fetchProductDetail(id);
      return current.value;
    } finally {
      loading.value = false;
    }
  };

  const loadRecommendations = async (payload) => {
    recommendations.value = await fetchRecommendations(payload);
  };

  return {
    list,
    featured,
    categories,
    current,
    recommendations,
    loading,
    pagination,
    filters,
    loadProducts,
    loadFeaturedProducts,
    loadProduct,
    loadRecommendations
  };
});
