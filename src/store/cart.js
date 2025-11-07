import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { loadFromStorage, saveToStorage } from "@/utils/helpers";
import { useToast } from "@/composables/useToast";

const STORAGE_KEY = "websc_cart";

// 购物车仓库：维护购物项列表、总数量/总金额及多种操作
export const useCartStore = defineStore("cart", () => {
  const { success } = useToast();
  
  // 初始化时同步本地缓存，便于刷新后恢复购物车
  const items = ref(loadFromStorage(STORAGE_KEY, []));

  const totalQuantity = computed(() =>
    items.value.reduce((sum, item) => sum + (item.count || 0), 0)
  );

  const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * (item.count || 0), 0).toFixed(2)
  );

  // 监听购物车变化并持久化到 localStorage
  watch(
    items,
    (value) => saveToStorage(STORAGE_KEY, value),
    { deep: true }
  );

  // 中文提示：购物车支持增删改、批量选中等基础操作
  const addItem = (product, count = 1) => {
    const target = items.value.find((item) => item.id === product.id);
    if (target) {
      target.count += count;
      success(`已将「${product.name}」数量增加至 ${target.count}`);
    } else {
      items.value.push({ ...product, count, checked: true });
      success(`已将「${product.name}」加入购物车`);
    }
  };

  const updateCount = (productId, count) => {
    const target = items.value.find((item) => item.id === productId);
    if (target) {
      target.count = Math.max(1, count);
    }
  };

  const removeItem = (productId) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const toggleAll = (checked) => {
    items.value = items.value.map((item) => ({ ...item, checked }));
  };

  const clear = () => {
    items.value = [];
  };

  return {
    items,
    totalQuantity,
    totalAmount,
    addItem,
    updateCount,
    removeItem,
    toggleAll,
    clear
  };
});
