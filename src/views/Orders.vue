<template>
  <section>
    <header class="section__header">
      <h2>订单中心</h2>
      <button @click="orderStore.loadOrders">刷新</button>
    </header>

    <div v-if="orderStore.list.length" class="order-list">
      <article v-for="order in orderStore.list" :key="order.id" class="order-card">
        <header>
          <div>
            <strong>订单号：{{ order.id }}</strong>
            <small>{{ formatDate(order.createdAt) }}</small>
          </div>
          <span>{{ order.status }}</span>
        </header>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            {{ item.name }} x {{ item.count }}
          </li>
        </ul>
        <footer>
          <p>应付：￥{{ order.amount }}</p>
          <div class="actions">
            <button v-if="order.status === '待支付'" @click="() => pay(order.id)">支付</button>
            <button v-if="order.status === '待支付'" class="ghost" @click="() => cancel(order.id)">
              取消
            </button>
          </div>
        </footer>
      </article>
    </div>
    <p v-else class="empty">暂无订单记录。</p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useOrderStore } from "@/store/order";
import { toDateTime } from "@/utils/format";

const orderStore = useOrderStore();
const formatDate = (value) => toDateTime(value);

const pay = async (id) => {
  await orderStore.pay(id);
};

const cancel = async (id) => {
  await orderStore.cancel(id);
};

// 页面加载时主动刷新订单列表
onMounted(() => {
  orderStore.loadOrders();
});
</script>

<style scoped>
.order-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
