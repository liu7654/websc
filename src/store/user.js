import { ref } from "vue";
import { defineStore } from "pinia";
import {
  fetchAddresses,
  saveAddress,
  deleteAddress,
  fetchFavorites,
  toggleFavorite
} from "@/api/user";
import { useAuthStore } from "./auth";

// 用户扩展信息仓库：处理地址簿、收藏夹等资料
export const useUserStore = defineStore("user", () => {
  const addresses = ref([]);
  const favorites = ref([]);
  const getUserId = () => useAuthStore().profile?.id;

  // 地址列表在进入个人中心时载入
  const loadAddresses = async () => {
    addresses.value = await fetchAddresses({ userId: getUserId() });
  };

  const upsertAddress = async (payload) => {
    const next = await saveAddress({
      ...payload,
      userId: payload?.userId || getUserId()
    });
    addresses.value = next;
    return next;
  };

  const removeAddress = async (id) => {
    const next = await deleteAddress(id, { userId: getUserId() });
    addresses.value = next;
    return next;
  };

  const loadFavorites = async () => {
    favorites.value = await fetchFavorites({ userId: getUserId() });
  };

  const toggleFavoriteItem = async (productId) => {
    await toggleFavorite({ productId, userId: getUserId() });
    await loadFavorites();
  };

  return {
    addresses,
    favorites,
    loadAddresses,
    upsertAddress,
    removeAddress,
    loadFavorites,
    toggleFavoriteItem
  };
});
