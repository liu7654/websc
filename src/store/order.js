import { ref } from "vue";
import { defineStore } from "pinia";
import {
  fetchOrders,
  createOrder,
  payOrder,
  cancelOrder,
  fetchOrderDetail
} from "@/api/order";
import { useAuthStore } from "./auth";

// 订单仓库：维护订单列表、当前查看的详情以及提交/支付/取消全流程
export const useOrderStore = defineStore("order", () => {
  const list = ref([]);
  const current = ref(null);
  const loading = ref(false);
  const getUserId = () => useAuthStore().profile?.id;

  // 拉取当前用户全部订单
  const loadOrders = async () => {
    loading.value = true;
    try {
      list.value = await fetchOrders({ userId: getUserId() });
    } finally {
      loading.value = false;
    }
  };

  const loadOrderDetail = async (id) => {
    current.value = await fetchOrderDetail(id);
    return current.value;
  };

  // 生成订单后立即追加到列表顶部，便于即时反馈
  const submitOrder = async (payload) => {
    const order = await createOrder({
      ...payload,
      userId: payload?.userId || getUserId()
    });
    list.value.unshift(order);
    return order;
  };

  const pay = async (id) => {
    const updated = await payOrder(id);
    await loadOrders();
    return updated;
  };

  const cancel = async (id) => {
    const updated = await cancelOrder(id);
    await loadOrders();
    return updated;
  };

  return {
    list,
    current,
    loading,
    loadOrders,
    loadOrderDetail,
    submitOrder,
    pay,
    cancel
  };
});
